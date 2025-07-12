import { User } from "@prisma/client";
import { CreateUserDto } from "../../dtos/createUser.dto";
import { UserService } from "../user.service";
import { db } from "../../config/db";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../../exceptions/customError.error";


export class UserServiceImple implements UserService{
    async deleteUser(id: number): Promise<void> {
       const isExist = await db.user.findFirst({
        where: {
            id
        },
       });

       if(!isExist) {
        throw new CustomError(StatusCodes.NOT_FOUND, `No user found with this ID ${id}`)
       }

        await db.user.delete({
        where: {
            id
        }
       })
    }
    async updateUser(id: number, data: Partial<CreateUserDto>): Promise<User> {
        const isUserExist = await db.user.findFirst({
            where:{id},
        });

        if(!isUserExist){
            throw new CustomError(404,`No user found with this ID ${id}`)
        }

        const updatedUser = await db.user.update(
            {where: {
                id
            },
            data
            });

        return updatedUser;
        
    }
    async getUserById(id: number): Promise<User | null> {
        const user = await db.user.findUnique({where: {id}});
        if(!user) {
            throw new CustomError(404,`user with ID ${id} does not exist`)
        }

        return user;
    }
    async getAllUsers(): Promise<User[]> {

        return await db.user.findMany();
    }
    async createUser(data: CreateUserDto): Promise<Omit<User, "password" | "role">> {
       const isUserExist = await db.user.findUnique({
        where : {email : data.email},
       });

       if(isUserExist){
        throw new CustomError(409, "oops! user alreadly exist")
       }

       const createUser = await db.user.create({
        data : {
            email : data.email,
            password: data.password,
            firstname: data.firstname,
            lastname: data.lastname,
            role: data.role,
        }
       });
       return createUser;
    }
    
}