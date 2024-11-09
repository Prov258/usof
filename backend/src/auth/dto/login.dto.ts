import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
    @IsNotEmpty()
    login: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}
