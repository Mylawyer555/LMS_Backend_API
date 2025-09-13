import express from "express";
import { CourseController } from "../controllers/courses.controller";
import { validateMiddleware } from "../middleswares/validationMiddleware.midddleware";
import { CreateCourseDTO } from "../dtos/createCourse.dto";

const courseController = new CourseController();
const courseRouter = express.Router();

courseRouter.post("/", validateMiddleware(CreateCourseDTO), courseController.createCourse)

courseRouter.get("/", courseController.getAllCourses)

courseRouter.get("/:id", courseController.getCourseById)

courseRouter.patch("/:id", courseController.updateCourse)

courseRouter.delete("/:id", courseController.deleteCourse)

courseRouter.get("/course-title/:title/course", courseController.getCourseByName)

export default courseRouter;