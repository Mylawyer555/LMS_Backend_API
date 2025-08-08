import { CreateUserDto } from "../dtos/createUser.dto";
import { LoginDTO } from "../dtos/login.dto";
import { AuthServiceImple } from "../service/imple/auth.sevice.imple";
import {StatusCodes} from "http-status-codes"
import {Request, Response, NextFunction} from "express"

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
}