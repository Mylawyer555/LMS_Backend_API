import {ValidationError, validate} from 'class-validator'
import {Request, Response, NextFunction} from 'express'


export const validateMiddleware = (type: any) => {
    return async (req:Request, res:Response, next:NextFunction) => {
        const errors: ValidationError[] = await validate(
            Object.assign(new type(), req.body)
        );

        if(errors.length > 0){
            res.status(400).json(errors);
        } else{
            next();
        }
    };
};