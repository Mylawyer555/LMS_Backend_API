import { Enrollment } from "@prisma/client";
import { InitiateEnrollmentDTO } from "../dtos/initiateEnrollment.dto";

export interface EnrollmentService {
    initiateEnrollment (data: InitiateEnrollmentDTO): Promise<{enrollment:Enrollment, paymentLink:string}>
    verifyPayment (reference:string): Promise<Enrollment>
}