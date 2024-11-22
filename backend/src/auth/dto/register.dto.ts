import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDto {
    @ApiProperty({
        example: 'johndoe123',
        type: String,
    })
    @IsNotEmpty()
    login: string;

    @ApiProperty({
        example: 'hardpassword',
        type: String,
    })
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        example: 'John Doe',
        type: String,
    })
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({
        example: 'johndoe123@gmail.com',
        type: String,
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;
}
