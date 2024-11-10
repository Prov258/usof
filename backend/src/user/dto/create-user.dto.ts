import { Role } from '@prisma/client';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    login: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    fullName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsEnum(Role)
    role?: Role;

    @IsBoolean()
    emailVerified?: boolean;
}
