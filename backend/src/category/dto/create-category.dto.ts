import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({
        example: 'javascript',
        type: String,
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
        example: 'category includes all topics with javascript',
        type: String,
    })
    @IsOptional()
    @IsString()
    description?: string;
}
