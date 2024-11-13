import { Status } from '@prisma/client';
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
} from 'class-validator';

export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsEnum(Status)
    status?: Status;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsOptional()
    @IsPositive({ each: true })
    @IsNotEmpty({ each: true })
    categories: number[] = [];
}
