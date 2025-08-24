import { CreateUserDto } from "../dtos/createUser.dto";
import { LoginDTO } from "../dtos/login.dto";
import { AuthServiceImple } from "../service/imple/auth.sevice.imple";
import {StatusCodes} from "http-status-codes"
import {Request, Response, NextFunction} from "express"
import { VerifyEmailDTO } from "../dtos/verifyEmail.dto";
import { RequestResetPasswordDTO, ResetPassword, ValidateOtpDTO } from "../dtos/resetPassword.dto";

export class AuthController {
    private  authService: AuthServiceImple;

    constructor() {
        this.authService = new AuthServiceImple();
    }

    public login = async (req:Request, res:Response, next:NextFunction):Promise<void>=>{
        try {
           const data: LoginDTO = req.body;
           const {accessToken, refreshToken} = await this.authService.login(data);
           res.status(201).json({accessToken, refreshToken})
        } catch (error) {
            next(error)
        }
    };

    public createUser = async (req: Request, res:Response, next:NextFunction):Promise<void>=>{
        try {
            const data: CreateUserDto = req.body;
            const user = await this.authService.createUser(data);
            res.status(201).json({
                error: false,
                message: `otp has been sent successfully to your email @ ${user.email}`,
            })
        } catch (error) {
            next(error)
        };
    };

     public verifyEmail = async (req:Request, res:Response, next:NextFunction):Promise<void>=>{
        try {
           const data: VerifyEmailDTO = req.body;
           const user = await this.authService.verifyEmail(data)
           res.status(201).json({
            error: false,
            message: "You have successfully registered",
            data:user,
           })
        } catch (error) {
            next(error)
        }
    };

    public resendOtp = async (req: Request, res:Response, next:NextFunction):Promise<void>=>{
        try {
            const {email} = req.body;
            if (!email){
                res.status(StatusCodes.NOT_FOUND)
                .json({
                    error: true,
                    message: "Email is required"
                });
            }

            const user = this.authService.resendOtp(email);
            res.status(201).json({
                error: false,
                message: "OTP has been sent succesfully",
                data: user,
            })
        } catch (error) {
            next(error)
        };
    };

    public requestPasswordReset = async (req:Request, res:Response, next:NextFunction):Promise<void>=>{
        try {
           const data: RequestResetPasswordDTO = req.body;
           const user = await this.authService.requestPasswordReset(data)
           res.status(201).json({
            error: false,
            message: `OTP has been sent to this ${data.email}`,
           });
        } catch (error) {
            next(error);
        }
    };
    public validateOtp = async (req:Request, res:Response, next:NextFunction):Promise<void>=>{
        try {
           const data: ValidateOtpDTO = req.body;
           const user = await this.authService.validateOtp(data)
           res.status(201).json({
            error: false,
            message: `OTP verified successfully`,
           });
        } catch (error) {
            next(error);
        }
    };
    public resetPassword = async (req:Request, res:Response, next:NextFunction):Promise<void>=>{
        try {
           const data:ResetPassword = req.body;
           const user = await this.authService.resetPassword(data)
           res.status(201).json({
            error: false,
            message: "Password changed successfully",
            
           });
        } catch (error) {
            next(error);
        }
    };
}