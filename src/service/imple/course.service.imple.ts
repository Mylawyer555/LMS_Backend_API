import { Course } from "@prisma/client";
import { CreateCourseDTO } from "../../dtos/createCourse.dto";
import { CourseService } from "../course.service";
import { db } from "../../config/db";
import { CustomError } from "../../exceptions/customError.error";
import { StatusCodes } from "http-status-codes";


export class CourseServiceImple implements CourseService{
    async getCourseByName(title: string): Promise<Course | null> {
        const course = await db.course.findUnique({
            where:{
                title,
            }
        })
        if(!course){
            throw new CustomError(StatusCodes.NOT_FOUND, "oops! no course found with this title")
        };
        return course;
    }
    async deleteCourse(id: number): Promise<void> {
         await db.course.delete({
            where:{
                id,
            }
        })
        return;
    }

    async updateCourse(id: number, data: Partial<CreateCourseDTO>): Promise<Course> {
       const isCourseExist = await db.course.findUnique({
        where:{
            id
        },
       });

       if(!isCourseExist){
        throw new CustomError(StatusCodes.NOT_FOUND, "No course found ")
       };

       const course = await db.course.update({
        where:{
            id,
        },
        data:{
            title:data.title,
            description:data.description,
            price: data.price,
            duration : data.duration,
        },
       });

       return course;
    }
    async getAllCourses(): Promise<Course[]> {
        return  await db.course.findMany();
        
    }
    
    async getCourseById(id: number): Promise<Course | null> {
        const course = await db.course.findUnique({
            where:{id},
        });

        if(!course){
            throw new CustomError(StatusCodes.NOT_FOUND, `No course found with this ${id} `)
        }

        return course;
    }
    async createCourse(data: CreateCourseDTO): Promise<Course> {
        const isCourseExist = await db.course.findUnique({
            where:{title: data.title},
        });

        if(isCourseExist){
            throw new CustomError(StatusCodes.CONFLICT, "oops! title already taken")
        };

        const user = await db.course.create({
            data:{
                title:data.title,
                description: data.description,
                price: data.price,
                duration: data.duration,

            },
        })

        return user;
    }
    
}