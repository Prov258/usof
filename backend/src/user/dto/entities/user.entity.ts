import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity {
    @ApiProperty({
        example: 1,
        type: Number,
    })
    id: number;

    @ApiProperty({
        example: 'johndoe123',
        type: String,
    })
    login: string;

    @ApiProperty({
        example: 'John Doe',
        type: String,
    })
    fullName: string;

    @ApiProperty({
        example: 'johndoe123@gmail.com',
        type: String,
    })
    email: string;

    @ApiProperty({
        example: '/avatars/default.png',
        type: String,
    })
    avatar: string;

    @ApiProperty({
        example: 6,
        type: Number,
    })
    rating: number;

    @ApiProperty({
        example: 'USER',
        type: String,
        enum: Role,
    })
    role: Role;

    @ApiProperty({
        example: '2024-11-21 16:49:11.733',
        type: String,
    })
    createdAt: Date;

    @ApiProperty({
        example: '2024-11-21 16:49:11.733',
        type: String,
    })
    updatedAt: Date;

    @ApiProperty({
        example: true,
        type: Boolean,
    })
    emailVerified: boolean;

    @Exclude()
    password: string;

    @Exclude()
    refreshToken: string;
}
