import { Course, User} from "@prisma/client";
import { CreateCourseDTO } from "../dtos/createCourse.dto";

export interface CourseService{
    createCourse(data:CreateCourseDTO): Promise<Course>
    getCourseById(id: number): Promise<Course | null>
    getAllCourses(): Promise<Course[]>
    updateCourse(id: number, data:Partial<CreateCourseDTO>): Promise<Course>
    deleteCourse(id: number): Promise<void>
    getCourseByName(title:string): Promise<Course | null>
}