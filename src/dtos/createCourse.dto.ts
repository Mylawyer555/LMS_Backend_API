import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCourseDTO {
    @IsNotEmpty({message:"Title of the course is required"})
    @IsString()
    title: string;
    @IsString()
    @IsNotEmpty({message:"Description of the course is required, Seperate each point with comma."})
    description: string;
    @IsNumber()
    @IsNotEmpty()
    price: number;
    @IsNumber()
    @IsNotEmpty()
    duration: number;
}