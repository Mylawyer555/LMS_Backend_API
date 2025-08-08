import express from "express"
import { AuthController } from "../controllers/authService.controller"

const authRouter = express.Router();
const authController = new AuthController();

authRouter.post("/", authController.login)
authRouter.post("/sign-up", authController.createUser)

export default authRouter;