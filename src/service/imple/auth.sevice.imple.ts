import { User } from "@prisma/client";
import configuration from "../../config/config";
import { db } from "../../config/db";
import { CreateUserDto } from "../../dtos/createUser.dto";
import { LoginDTO } from "../../dtos/login.dto";
import { CustomError } from "../../exceptions/customError.error";
import { comparePassword, hashPassword } from "../../utils/passaword.util";
import {sendOtpEmail, welcomeEmail} from '../../utils/email.util'
import { AuthService } from "../auth.service";
import jwt,{SignOptions} from "jsonwebtoken"
import { generateOtp } from "../../utils/otp.util";
import {StatusCodes} from 'http-status-codes'
import { VerifyEmailDTO } from "../../dtos/verifyEmail.dto";
import WelcomeEmail from "../../emails/welcomeEmail";
import dotenv from 'dotenv'
import { RequestResetPasswordDTO, ResetPassword, ValidateOtpDTO } from "../../dtos/resetPassword.dto";


dotenv.config();
const newOtp = generateOtp();

export class AuthServiceImple implements AuthService{
    async resetPassword(data: ResetPassword): Promise<void> {
        const user = await db.user.findUnique({
            where: {
                email: data.email,
            },
        });
        if(!user){
            throw new CustomError(
                StatusCodes.NOT_FOUND,
                "No user found with email"
            );
        };

       const hashPa = await hashPassword(data.newPassword);

       await db.user.update({
        where: {
            email : data.email,
        },
        data:{
            password: hashPa,
            otp: null,
            otpExpiry: null,
        },
       });

       


    }
    async validateOtp(data: ValidateOtpDTO): Promise<void> {
        const user = await db.user.findUnique({
            where:{
                email: data.email,
            },
        });

        if(!user){
            throw new CustomError(
                StatusCodes.NOT_FOUND,
                "No user found with this email"
            );
        };

        if(!user.otp || !user.otpExpiry){
            throw new CustomError(StatusCodes.BAD_REQUEST, "OTP verification is not available for this user")
        }

       // check if otp is valid
       const isValidOtp = await comparePassword(data.otp, user.otp);
       if(!isValidOtp){
        throw new CustomError(
            StatusCodes.BAD_REQUEST,
            "Invalid OTP or OTP has expired"
        );
       };

    }
    async requestPasswordReset(data: RequestResetPasswordDTO): Promise<void> {
       const user = await db.user.findUnique({
        where:{
            email: data.email,
        },
       });

       if(!user) {
        throw new CustomError(StatusCodes.NOT_FOUND, "No user found with such email")
       };

       if(!user.emailVerified){
        throw new CustomError(StatusCodes.BAD_REQUEST, "Email not verified, Please verify your email")
       };

       const hashedOtp = await hashPassword(newOtp)
       await db.user.update({
        where:{
            email: data.email,
        },
        data:{
            otp: hashedOtp,
            otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
        },
       })

       sendOtpEmail({
        to: data.email,
        subject: "Reset Password OTP",
        otp : newOtp,
       })
    };
    
    async resendOtp(email: string): Promise<void> {
        const user = await db.user.findUnique({
            where:{
                email
            }
        })
        if(!user){
            throw new CustomError(StatusCodes.NOT_FOUND, "No user found ")
        };
        if(user.emailVerified){
            throw new CustomError(StatusCodes.BAD_REQUEST, "Email is already verified")
        }

        const hashedOtp = await hashPassword(newOtp);
        await db.user.update({
            where:{
                id: user.id,
            },
            data: {
                otp: hashedOtp,
                otpExpiry: user.otpExpiry,
            }
        });

        sendOtpEmail({
            to: user.email,
            subject: "Your New OTP",
            otp: newOtp,
        });
    }
    async verifyEmail(data: VerifyEmailDTO): Promise<User> {
        const user = await db.user.findUnique({
            where: {
                email : data.email,
            }
        });

        if(!user) {
            throw new CustomError(StatusCodes.NOT_FOUND, "email address not found ")
        };
        if(user.emailVerified){
            throw new CustomError(StatusCodes.BAD_REQUEST, "Email already verified")
        }
        if(!user.otp || !user.otpExpiry){
            throw new CustomError(StatusCodes.BAD_REQUEST, "OTP not available for this user")
        }

        /* check if OTP is valid */
        const isOtpValid = await comparePassword(data.otp, user.otp)
        if(!isOtpValid){
            throw new CustomError(StatusCodes.BAD_REQUEST, "Invalid OTP")
        };

        // check if OTP is expired
        
       user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10mins
       
       
       const isOtpExpired = user.otpExpiry < new Date();
        if(isOtpExpired){
            throw new CustomError(StatusCodes.BAD_REQUEST, "OTP is expired")
        };

        // Update User Registration
        const userReg = await db.user.update({
            where: {
                id: user.id,
            },
            data: {
                emailVerified: true,
                otp: null,
                otpExpiry: null,
            },
        });

        // send a welcome email 
        await welcomeEmail({
            to: userReg.email,
            subject: "Welcome to Futurerify",
            name: userReg.firstname + " " + userReg.lastname,
        })

        return userReg;
    }

    
    async createUser(data: CreateUserDto):Promise<User> {
        const otp = generateOtp()
        const isUserExist = await db.user.findFirst({
            where:{
                email:data.email,
            },
        });

        if(isUserExist){
            throw new CustomError(409, "oops! user email already taken")
        };
        const hashedOtp = await hashPassword(otp);
        const maRetries = 3;
        for(let attempt = 1; attempt <= maRetries; attempt++){
            try {
                return await db.$transaction(async (transaction) =>{
                    const user = await transaction.user.create({
                        data:{
                            email:data.email,
                            password: await hashPassword(data.password),
                            firstname: data.firstname,
                            lastname: data.lastname,
                            role: data.role,
                            otp: hashedOtp,
                            otpExpiry: this.generateOtpExpiration(), 
                        },

                    });

                    await sendOtpEmail({
                        to: data.email,
                        subject: "Verify Your Email",
                        otp,
                    })
                    return user;
                })
            } catch (error) {
                console.warn(`Retry ${attempt} due to transaction failure`, error);
                if(attempt === maRetries){
                    throw new CustomError(
                        StatusCodes.INTERNAL_SERVER_ERROR,
                        'Failed to create user after multiple retry'
                    )
                };
            };
        };
        throw new CustomError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Unexpected error occurred during user creation'
        );
    }

    async login(data: LoginDTO): Promise<{ accessToken: string; refreshToken: string; }> {
        const user = await db.user.findUnique({
            where:{
                email: data.email,
            },
        })

        if(!user){
            throw new CustomError(401, "Invalid password or email")
        };

        const isPasswordValid = await comparePassword(data.password, user.password);

        if(!isPasswordValid){
            throw new CustomError(401, "Invalid email or password")
        };

        const fullName = user.firstname + " "+ user.lastname;

        const accessToken = this.generateAccessToken(user.id, fullName, user.role);

        const refreshToken = this.generateRefreshToken(user.id, fullName, user.role);

        return {
            accessToken,
            refreshToken
        };

    }



    generateAccessToken(userId:number, name:string, role:string):string {
       const secret = configuration.jwt.secret;
       const expiresIn = configuration.jwt.expires

       if(!secret){
        throw Error("Jwt key not set")
       }

       const options:SignOptions = {expiresIn};

       return jwt.sign({id:userId, name, role}, secret, options)
    };

    generateRefreshToken(userId:number, name:string, role:string):string {
        return jwt.sign({id: userId, name, role}, configuration.jwt.secret, {
            expiresIn: configuration.jwt.refresh_expires,
        });
    };

    generateOtpExpiration(){
        return new Date(Date.now() + 10 * 60 * 1000)
    }
    
}

