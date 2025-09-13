import { NextFunction, Request, Response } from "express";
import { CourseService } from "../service/course.service";
import { CourseServiceImple } from "../service/imple/course.service.imple";
import { CreateCourseDTO } from "../dtos/createCourse.dto";
import { StatusCodes } from "http-status-codes";

export class CourseController{
    private courseService: CourseService;

    constructor(){
        this.courseService = new CourseServiceImple();
    }

    public createCourse = async(req:Request, res:Response, next:NextFunction):Promise<void> =>{
       try {
         const courseData = req.body as CreateCourseDTO;
         const newCourse = this.courseService.createCourse(courseData);
         res.status(201).json(newCourse);
       } catch (error) {
        next(error)
       }

    }
    public getCourseById = async(req:Request, res:Response, next:NextFunction):Promise<void> =>{
       try {
         const courseId = parseInt(req.params.id) 
         const course = this.courseService.getCourseById(courseId);
         res.status(200).json(course);
       } catch (error) {
        next(error)
       }

    }
    public getAllCourses = async(req:Request, res:Response, next:NextFunction):Promise<void> =>{
       try {
        
         const course = this.courseService.getAllCourses();
         res.status(200).json(course);
       } catch (error) {
        next(error)
       }

    }
    public updateCourse = async(req:Request, res:Response, next:NextFunction):Promise<void> =>{
       try {
         const id = parseInt(req.params.id)
         const courseData = req.body as Partial<CreateCourseDTO>
         const course = this.courseService.updateCourse(id,courseData)
         res.status(201).json(course);
       } catch (error) {
        next(error)
       }

    }
    public deleteCourse = async(req:Request, res:Response, next:NextFunction):Promise<void> =>{
       try {
         const courseId = parseInt(req.params.id)
         await this.courseService.deleteCourse(courseId)
         res.status(204).json();
       } catch (error) {
        next(error)
       }

    }
    public getCourseByName = async(req:Request, res:Response, next:NextFunction):Promise<void> =>{
       try {
         const courseTitle = req.params.title 
         const course =  this.courseService.getCourseByName(courseTitle)
         res.status(200).json(course);
       } catch (error) {
        next(error)
       }

    }


}