import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { UpdateCommentDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Comment, Like, LikeType, Role, User } from '@prisma/client';
import { CreateLikeDto } from 'src/like/dto/create-like.dto';

@Injectable()
export class CommentService {
    constructor(private prisma: PrismaService) {}

    async findOne(id: number): Promise<Comment> {
        return await this.prisma.comment.findUnique({
            where: {
                id,
            },
        });
    }

    async getCommentLikes(commentId: number): Promise<Like[]> {
        const comment = await this.prisma.comment.findUnique({
            where: {
                id: commentId,
            },
        });

        if (!comment) {
            throw new NotFoundException("Comment doesn't exist");
        }

        return await this.prisma.like.findMany({
            where: {
                comment: {
                    id: commentId,
                },
            },
        });
    }

    async createCommentLike(
        commentId: number,
        user: User,
        createLikeDto: CreateLikeDto,
    ): Promise<Like> {
        const comment = await this.findOne(commentId);

        if (!comment) {
            throw new NotFoundException("Comment doesn't exist");
        }

        const like = await this.prisma.like.findFirst({
            where: {
                authorId: user.id,
                commentId,
            },
        });

        if (like) {
            throw new BadRequestException("You've already liked this post");
        }

        const increment = createLikeDto.type === LikeType.LIKE ? 1 : -1;
        const [_, newLike] = await this.prisma.$transaction([
            this.prisma.comment.update({
                where: {
                    id: commentId,
                },
                data: {
                    rating: {
                        increment,
                    },
                    author: {
                        update: {
                            rating: {
                                increment,
                            },
                        },
                    },
                },
            }),
            this.prisma.like.create({
                data: {
                    authorId: user.id,
                    commentId,
                    type: createLikeDto.type,
                },
                include: {
                    comment: true,
                },
            }),
        ]);

        return newLike;
    }

    async update(
        commentId: number,
        user: User,
        updateCommentDto: UpdateCommentDto,
    ): Promise<Comment> {
        const comment = await this.findOne(commentId);

        if (!comment) {
            throw new NotFoundException("Comment doesn't exist");
        }

        if (comment.authorId !== user.id) {
            throw new ForbiddenException('Forbidden to update comment');
        }

        return await this.prisma.comment.update({
            where: {
                id: commentId,
            },
            data: updateCommentDto,
        });
    }

    async remove(commentId: number, user: User): Promise<Comment> {
        const comment = await this.findOne(commentId);

        if (!comment) {
            throw new NotFoundException("Comment doesn't exist");
        }

        if (comment.authorId !== user.id && user.role !== Role.ADMIN) {
            throw new ForbiddenException('Forbidden to delete comment');
        }

        return await this.prisma.comment.delete({
            where: {
                id: commentId,
            },
        });
    }

    async removeCommentLike(commentId: number, user: User): Promise<Like> {
        const comment = await this.findOne(commentId);

        if (!comment) {
            throw new NotFoundException("Comment doesn't exist");
        }

        const like = await this.prisma.like.findFirst({
            where: {
                authorId: user.id,
                commentId,
            },
        });

        if (!like) {
            throw new NotFoundException('Like not found');
        }

        const increment = like.type === LikeType.LIKE ? -1 : 1;
        const [_, deletedLike] = await this.prisma.$transaction([
            this.prisma.comment.update({
                where: {
                    id: commentId,
                },
                data: {
                    rating: {
                        increment,
                    },
                    author: {
                        update: {
                            rating: {
                                increment,
                            },
                        },
                    },
                },
            }),
            this.prisma.like.delete({
                where: {
                    id: like.id,
                },
                include: {
                    comment: true,
                },
            }),
        ]);

        return deletedLike;
    }
}
