import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Prisma, Role, User } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from './dto/entities/user.entity';
import fs from 'fs/promises';
import path from 'path';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<UserEntity> {
        if (
            !(await this.isUserUnique(createUserDto.login, createUserDto.email))
        ) {
            throw new BadRequestException('User already exists');
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        const newUser = await this.prisma.user.create({
            data: {
                ...createUserDto,
                avatar: this.configService.get<string>('DEFAULT_AVATAR_PATH'),
                password: hashedPassword,
            },
        });

        return plainToInstance(UserEntity, newUser);
    }

    async findAll(): Promise<UserEntity[]> {
        const users = await this.prisma.user.findMany();

        return plainToInstance(UserEntity, users);
    }

    async findOne(id: number): Promise<UserEntity> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        return plainToInstance(UserEntity, user);
    }

    async findByTemplate(
        template: Prisma.UserWhereInput,
    ): Promise<UserEntity[]> {
        const users = await this.prisma.user.findMany({
            where: template,
        });

        return plainToInstance(UserEntity, users);
    }

    async update(
        id: number,
        user: User,
        updateUserDto: UpdateUserDto,
    ): Promise<UserEntity> {
        if (user.id !== id && user.role !== Role.ADMIN) {
            throw new ForbiddenException('No permission to update user');
        }

        if (
            !(await this.isUserUnique(
                updateUserDto?.login,
                updateUserDto?.email,
            ))
        ) {
            throw new BadRequestException('User already exists');
        }

        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(
                updateUserDto.password,
                10,
            );
        }

        const updatedUser = await this.prisma.user.update({
            where: {
                id,
            },
            data: updateUserDto,
        });

        return plainToInstance(UserEntity, updatedUser);
    }

    async uploadAvatar(
        user: User,
        avatar: Express.Multer.File,
    ): Promise<UserEntity> {
        if (!avatar) {
            throw new BadRequestException('Invalid image');
        }

        const defaultAvatarPath = this.configService.get<string>(
            'DEFAULT_AVATAR_PATH',
        );

        if (user.avatar !== null && user.avatar !== defaultAvatarPath) {
            try {
                await fs.unlink(
                    path.join(
                        __dirname,
                        '..',
                        '..',
                        'public',
                        'avatars',
                        user.avatar,
                    ),
                );
            } catch {
                throw new InternalServerErrorException(
                    'Failed to delete image',
                );
            }
        }

        const updatedUser = await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                avatar: `/avatars/${avatar.filename}`,
            },
        });

        return plainToInstance(UserEntity, updatedUser);
    }

    async remove(id: number, user: User): Promise<UserEntity> {
        if (user.id !== id && user.role !== Role.ADMIN) {
            throw new ForbiddenException('No permission to update user');
        }

        const deletedUser = await this.prisma.user.delete({
            where: {
                id,
            },
        });

        return plainToInstance(UserEntity, deletedUser);
    }

    async isUserUnique(login: string, email: string): Promise<boolean> {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [{ login }, { email }],
            },
        });

        return user === null;
    }
}
