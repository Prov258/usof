import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class EmailVerificationDto {
    @ApiProperty({
        example: 'johndoe123@gmail.com',
        type: String,
    })
    @IsEmail()
    email: string;
}
