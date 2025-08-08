import { User } from "@prisma/client";
import configuration from "../../config/config";
import { db } from "../../config/db";
import { CreateUserDto } from "../../dtos/createUser.dto";
import { LoginDTO } from "../../dtos/login.dto";
import { CustomError } from "../../exceptions/customError.error";
import { comparePassword, hashPassword } from "../../utils/passaword.util";
import {sendOtpEmail} from '../../utils/email.util'
import { AuthService } from "../auth.service";
import jwt,{SignOptions} from "jsonwebtoken"
import { generateOtp } from "../../utils/otp.util";
import {StatusCodes} from 'http-status-codes'

export class AuthServiceImple implements AuthService{
    async createUser(data: CreateUserDto):Promise<User> {
        const otp = generateOtp()
        const isUserExist = await db.user.findFirst({
            where:{
                email:data.email,
            },
        });

        if(!isUserExist){
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

