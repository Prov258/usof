import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
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

    @ApiProperty({
        example: 'USER',
        type: String,
        enum: Role,
    })
    @IsEnum(Role)
    role?: Role;

    @ApiProperty({
        example: false,
        type: Boolean,
    })
    @IsBoolean()
    emailVerified?: boolean;
}
