import { ApiProperty } from '@nestjs/swagger';
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
    @ApiProperty({
        example: 'How to center div?',
        type: String,
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
        example: 'ACTIVE',
        type: String,
        enum: Status,
    })
    @IsOptional()
    @IsEnum(Status)
    status?: Status;

    @ApiProperty({
        example: 'Please give me some advices',
        type: String,
    })
    @IsNotEmpty()
    @IsString()
    content: string;

    @ApiProperty({
        example: ['javascript', 'web'],
        type: Array<String>,
    })
    @IsOptional()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    categories: string[] = [];
}
