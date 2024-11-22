import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendPasswordResetDto {
    @ApiProperty({
        example: 'johndoe123@gmail.com',
        type: String,
    })
    @IsEmail()
    email: string;
}
