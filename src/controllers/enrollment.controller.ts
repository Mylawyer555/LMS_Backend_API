import { NextFunction, Request, Response } from "express";
import { EnrollmentServiceImple } from "../service/imple/enrollment.service.imple";
import { InitiateEnrollmentDTO } from "../dtos/initiateEnrollment.dto";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../exceptions/customError.error";

export class EnrollmentController {
    private enrollmentService : EnrollmentServiceImple;
    
    constructor(){
        this.enrollmentService = new EnrollmentServiceImple()
    }

    public initiateEnrollment = async (req:Request, res:Response, next:NextFunction):Promise<void> => {
        try {
            const data = req.body as InitiateEnrollmentDTO;
            const {enrollment, paymentLink} = await this.enrollmentService.initiateEnrollment(data)
            res.status(StatusCodes.OK).json({
                message:"Enrollment initiated successfully!",
                enrollment,
                paymentLink,
            });
        } catch (error) {
            next(error);
        };
    }

    public verifyPayment = async (req:Request, res:Response, next:NextFunction):Promise<void> =>{
        try {
            const reference = req.query.reference as string
            if(!reference){
                throw new CustomError(StatusCodes.BAD_REQUEST, "missing required parameter: reference")
            };

            const updatedEnrollment = await this.enrollmentService.verifyPayment(reference)
            res.status(StatusCodes.OK).json({
                message:"Enrollemnt updated successfully",
                enrollemnt:updatedEnrollment,
            })
        } catch (error) {
            next(error);
        };
    }
    

    
}