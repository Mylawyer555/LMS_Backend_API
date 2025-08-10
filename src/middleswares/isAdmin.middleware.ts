import {Role} from '@prisma/client';
import { Response, NextFunction } from 'express';
import { CustomError } from '../exceptions/customError.error';
import { StatusCodes } from 'http-status-codes';
import { db } from '../config/db';
import { CustomRequest } from './auth.middleware';


const isAdmin  = async(req:CustomRequest, res:Response, next:NextFunction)=>{
    try {
        //check if user exist in db
        const user = await db.user.findUnique({
            where: {
                id: Number(req.userAuth), // req.userAuth obtains the id of the logged-in user
            },
        });
        if(!user){
            res.status(StatusCodes.NOT_FOUND).json({
                message: 'User not found'
            })
        }
        if(user?.role === Role.ADMIN){
            next();
        }else{
            res.status(StatusCodes.FORBIDDEN).json({
                message:'Access denied'
            })
        }
    } catch (error) {
        next(error);
    }
};

export default isAdmin;