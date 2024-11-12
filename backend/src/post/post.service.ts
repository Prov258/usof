import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationOptionsDto } from './dto/pagination-options.dto';
import { Paginated } from './dto/paginated';
import { Post, Prisma, Role, Status, User } from '@prisma/client';

@Injectable()
export class PostService {
    constructor(private prisma: PrismaService) {}

    create(createPostDto: CreatePostDto) {
        return 'This action adds a new post';
    }

    async findAll(
        { page, limit }: PaginationOptionsDto,
        user: User,
    ): Promise<Paginated<Post>> {
        const where: Prisma.PostWhereInput = {
            status: user.role === Role.ADMIN ? null : Status.ACTIVE,
        };

        const [posts, count] = await this.prisma.$transaction([
            this.prisma.post.findMany({
                where,
                take: limit,
                skip: limit * (page - 1),
            }),
            this.prisma.post.count({ where }),
        ]);

        const pageCount = Math.ceil(count / limit);

        return {
            data: posts,
            meta: {
                page,
                limit,
                itemCount: count,
                pageCount,
                prev: page > 1 ? page - 1 : null,
                next: page < pageCount ? page + 1 : null,
            },
        };
    }

    async findOne(id: number) {
        return await this.prisma.post.findUnique({
            where: {
                id,
            },
        });
    }

    async findComments(postId: number, { page, limit }: PaginationOptionsDto) {
        const where: Prisma.CommentWhereInput = {
            postId,
        };

        const [comments, count] = await this.prisma.$transaction([
            this.prisma.comment.findMany({
                where,
                take: limit,
                skip: limit * (page - 1),
            }),
            this.prisma.comment.count({ where }),
        ]);

        const pageCount = Math.ceil(count / limit);

        return {
            data: comments,
            meta: {
                page,
                limit,
                itemCount: count,
                pageCount,
                prev: page > 1 ? page - 1 : null,
                next: page < pageCount ? page + 1 : null,
            },
        };
    }

    update(id: number, updatePostDto: UpdatePostDto) {
        return `This action updates a #${id} post`;
    }

    remove(id: number) {
        return `This action removes a #${id} post`;
    }
}
