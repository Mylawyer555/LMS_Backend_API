import { User } from "@prisma/client";
import { CreateUserDto } from "../dtos/createUser.dto";
import { LoginDTO } from "../dtos/login.dto";
import { VerifyEmailDTO } from "../dtos/verifyEmail.dto";
import { RequestResetPasswordDTO, ResetPassword, ValidateOtpDTO } from "../dtos/resetPassword.dto";


export interface AuthService {
    login(data:LoginDTO):Promise<{accessToken:string, refreshToken:string}>
    createUser(data: CreateUserDto): Promise<User>
    verifyEmail(data: VerifyEmailDTO): Promise<User>
    resendOtp(email: string): Promise<void>
    requestPasswordReset(data: RequestResetPasswordDTO): Promise<void>
    validateOtp(data: ValidateOtpDTO): Promise<void>
    resetPassword(data: ResetPassword): Promise<void>
}