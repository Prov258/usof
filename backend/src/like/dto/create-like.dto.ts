import { ApiProperty } from '@nestjs/swagger';
import { LikeType } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateLikeDto {
    @ApiProperty({
        example: 'LIKE',
        type: String,
        enum: LikeType,
    })
    @IsNotEmpty()
    @IsEnum(LikeType)
    type: LikeType;
}
