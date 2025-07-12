import { NextFunction, Request, Response } from "express";
import { UserServiceImple } from "../service/imple/user.service.imple";
import { UserService } from "../service/user.service"
import { CreateUserDto } from "../dtos/createUser.dto";

export class UserController{
    private userService: UserService;

    constructor(){
        this.userService = new UserServiceImple();
    }

    public createUser = async (req:Request, res:Response, next:NextFunction):Promise<void>=>{
        try {
            const user = req.body as CreateUserDto;
            const createUser = await this.userService.createUser(user);
            res.status(201).json(createUser);
        } catch (error) {
            next(error)
        }
    };

    public getAllUser = async (req:Request, res:Response, next:NextFunction):Promise<void>=>{
        try {
            const user = await this.userService.getAllUsers();
            res.status(200).json(user);
        } catch (error) {
            next(error)
        }
    };
    public getUserById = async (req:Request, res:Response, next:NextFunction):Promise<void>=>{
        try {
            const id = Number(req.params.id)
            const user = await this.userService.getUserById(id);
            res.status(200).json(user);
        } catch (error) {
            next(error)
        }
    };
    public updateUser = async (req:Request, res:Response, next:NextFunction):Promise<void>=>{
        try {
            const id = Number(req.params.id)
            const userBody = req.body as Partial<CreateUserDto>;
            const user = await this.userService.updateUser(id, userBody);
            res.status(200).json(user);
        } catch (error) {
            next(error)
        }
    };
     public deleteUser= async (req:Request, res:Response, next:NextFunction):Promise<void>=>{
        try {
            const id = Number(req.params.id)
            const user = await this.userService.deleteUser(id);
            res.status(204).json(user);
        } catch (error) {
            next(error)
        }
    };
}