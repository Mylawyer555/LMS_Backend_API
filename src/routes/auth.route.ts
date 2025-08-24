import express from "express"
import { AuthController } from "../controllers/authService.controller"
import { validateMiddleware } from "../middleswares/validationMiddleware.midddleware";
import { LoginDTO } from "../dtos/login.dto";
import { CreateUserDto } from "../dtos/createUser.dto";
import { VerifyEmailDTO } from "../dtos/verifyEmail.dto";
import WelcomeEmail from "../emails/welcomeEmail";
import { RequestResetPasswordDTO, ResetPassword, ValidateOtpDTO } from "../dtos/resetPassword.dto";

const authRouter = express.Router();
const authController = new AuthController();

authRouter.post("/", validateMiddleware(LoginDTO), authController.login);

authRouter.post("/sign-up", validateMiddleware(CreateUserDto), authController.createUser);

authRouter.post("/verify-email", validateMiddleware(VerifyEmailDTO), authController.verifyEmail);

authRouter.post("/resend-otp",authController.resendOtp)

authRouter.post("/request-password-reset-otp", validateMiddleware(RequestResetPasswordDTO), authController.requestPasswordReset)

authRouter.post("/validate-otp", validateMiddleware(ValidateOtpDTO), authController.validateOtp)

authRouter.post("/reset-password", validateMiddleware(ResetPassword), authController.resetPassword)


export default authRouter;