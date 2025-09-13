import { Enrollment, Course, EnrollmentStatus, PaymentStatus } from "@prisma/client";
import { db } from "../../config/db";
import { InitiateEnrollmentDTO } from "../../dtos/initiateEnrollment.dto";
import { EnrollmentService } from "../enrollment.service";
import { PaymentServiceImple } from "../payment.service";
import { CustomError } from "../../exceptions/customError.error";
import { StatusCodes } from "http-status-codes";

export class EnrollmentServiceImple implements EnrollmentService{

    private paymentService = new PaymentServiceImple();

    async initiateEnrollment(data: InitiateEnrollmentDTO): Promise<{ enrollment: Enrollment; paymentLink: string; }> {
        // verify if course exist
        const course = await db.course.findUnique({
            where:{
                id: data.courseId,
            },
        });

        if(!course){
            throw new CustomError(404, 'Course not found')
        };

        // verify if user exist and if email verified
        const user = await db.user.findUnique({
            where:{
                id: data.userId,
            },
        });

        if(!user){
            throw new CustomError(404, 'user not found')
        };
        if(!user.emailVerified){
            throw new CustomError(StatusCodes.BAD_REQUEST, 'User email not verified, Please verify!')
        };
        
        // initialize payment using paystack
        const paymentResponse = await this.paymentService.initializePayment(
            user.email,
            course.price,
            {
                enrollmentId: "",
                courseTitle: course.title,
            },
        );

        //create enrollment record with PENDING status and save the patstack reference
        const enrollment = await db.enrollment.create({
           data:{
                userId: data.userId,
                courseId: data.courseId,
                instructorId: data.instructorId,
                paymentStatus: PaymentStatus.PENDING,
                payStackReference: paymentResponse.reference, //save the reference
            },
        })

        return {enrollment, paymentLink: paymentResponse.authorization_url}
    };

    async verifyPayment(reference: string): Promise<Enrollment> {
        const enrollment = await db.enrollment.findUnique({
            where:{
                payStackReference:reference,
            },
        });

        if(!enrollment){
            throw new CustomError(StatusCodes.NOT_FOUND, "Enrollment not found for the given reference")
        };

        // update enrollment status
        const updateEnrollment = await db.enrollment.update({
            where:{
                id: enrollment.id
            },
            data:{
                paymentStatus: PaymentStatus.PAID
            }
        })

        return updateEnrollment;

    };
    
    
};