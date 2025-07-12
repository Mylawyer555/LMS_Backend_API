import { User } from "@prisma/client";
import { CreateUserDto } from "../dtos/createUser.dto";

export interface UserService {
    createUser(data: CreateUserDto):Promise<Omit<User, "password" | "role">>;
    getAllUsers():Promise<User[]>;
    getUserById(id:number):Promise<User | null>;
    updateUser(id:number, data:Partial<CreateUserDto>):Promise<User>;
    deleteUser(id:number):Promise<void>;
}