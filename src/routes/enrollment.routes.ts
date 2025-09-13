import express from 'express'
import { EnrollmentController } from '../controllers/enrollment.controller';


const enrollmentRouter =express.Router();
const enrollmentController = new EnrollmentController();

enrollmentRouter.post("/initiate", enrollmentController.initiateEnrollment)
enrollmentRouter.get("/verify-payment", enrollmentController.verifyPayment)


export default enrollmentRouter;