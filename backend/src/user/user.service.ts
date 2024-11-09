import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private configService: ConfigService,
    ) {}

    async create(createUserDto: CreateUserDto) {
        return await this.prisma.user.create({
            data: createUserDto,
        });
    }

    async findAll() {
        return await this.prisma.user.findMany();
    }

    async findOne(id: number) {
        return await this.prisma.user.findUnique({
            where: { id },
        });
    }

    async findByTemplate(template: Prisma.UserWhereInput): Promise<User[]> {
        return await this.prisma.user.findMany({
            where: template,
        });
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        return await this.prisma.user.update({
            where: {
                id,
            },
            data: updateUserDto,
        });
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
