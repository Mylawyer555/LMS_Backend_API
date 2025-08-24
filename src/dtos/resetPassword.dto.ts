import { IS_LENGTH, IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class RequestResetPasswordDTO {
    @IsNotEmpty()
    @IsEmail()
    email: string;
};

export class ValidateOtpDTO {
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    @IsString()
    otp: string;
};

export class ResetPassword {
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    @IsString()
    @Length(6, 20)
    newPassword: string;
};