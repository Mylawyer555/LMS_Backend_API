import { User } from "@prisma/client";
import { CreateUserDto } from "../dtos/createUser.dto";
import { LoginDTO } from "../dtos/login.dto";


export interface AuthService {
    login(data:LoginDTO):Promise<{accessToken:string, refreshToken:string}>
    createUser(data: CreateUserDto): Promise<User>
}