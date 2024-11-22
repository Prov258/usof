import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PasswordResetDto {
    @ApiProperty({
        example: 'hardpassword',
        type: String,
    })
    @IsNotEmpty()
    password: string;
}
