import { LikeType } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateLikeDto {
    @IsNotEmpty()
    @IsEnum(LikeType)
    type: LikeType;
}
