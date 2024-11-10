import { Exclude } from 'class-transformer';

export class UserEntity {
    id: number;
    login: string;
    fullName: string;
    email: string;
    avatar: string;
    rating: number;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    emailVerified: boolean;

    @Exclude()
    password: string;

    @Exclude()
    refreshToken: string;
}
