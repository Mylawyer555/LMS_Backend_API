import { Role } from "@prisma/client"
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, length, Length} from "class-validator"

export class CreateUserDto {
    @IsNotEmpty({message:"Firstname is required"})
    @Length(2, 50, {
        message: "firstname should not be less than 2 characters and not more than 50 character length"
    })
    firstname! : string;

    @IsNotEmpty({message:"lastname is required"})
    @Length(2, 5, {message: "Lastname should not be less than 2 characters and not more than 50 character length"})
    lastname! : string;

    @IsEmail()
    email! : string;

    @IsNotEmpty()
    @Length(5, 35)
    password! : string

    @IsOptional()
    @IsNotEmpty()
    @IsEnum(Role)
    role? : Role;
}