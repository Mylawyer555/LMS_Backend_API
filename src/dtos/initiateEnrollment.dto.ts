import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class InitiateEnrollmentDTO {
    @IsNotEmpty()
    @IsNumber()
    userId: number;
    @IsNotEmpty()
    @IsNumber()
    courseId: number;
    @IsNumber()
    @IsOptional()
    instructorId?: number
}