import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationOptionsDto } from './dto/pagination-options.dto';
import { Paginated } from './dto/paginated';
import {
    Category,
    Comment,
    Like,
    LikeType,
    Post,
    Prisma,
    Role,
    Status,
    User,
} from '@prisma/client';
import { CreateCommentDto } from 'src/comment/dto/create-comment.dto';
import { CreateLikeDto } from './dto/create-like.dto';

@Injectable()
export class PostService {
    constructor(private prisma: PrismaService) {}

    async create(user: User, createPostDto: CreatePostDto): Promise<Post> {
        for (let categoryId of createPostDto.categories) {
            const category = await this.prisma.category.findUnique({
                where: {
                    id: categoryId,
                },
            });

            if (!category) {
                throw new NotFoundException(
                    `Category with id ${categoryId} doesn't exist`,
                );
            }
        }

        return await this.prisma.post.create({
            data: {
                authorId: user.id,
                ...createPostDto,
                categories: {
                    create: createPostDto.categories.map((id) => ({
                        category: {
                            connect: {
                                id,
                            },
                        },
                    })),
                },
            },
        });
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

    async findOne(id: number): Promise<Post> {
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

    async createPostComment(
        postId: number,
        user: User,
        createCommentDto: CreateCommentDto,
    ): Promise<Comment> {
        const post = await this.findOne(postId);

        if (!post || post.status === Status.INACTIVE) {
            throw new ForbiddenException('Post is missing or inactive');
        }

        return await this.prisma.comment.create({
            data: {
                postId,
                authorId: user.id,
                ...createCommentDto,
            },
        });
    }

    async getPostCategories(postId: number): Promise<Category[]> {
        return await this.prisma.category.findMany({
            where: {
                posts: {
                    some: {
                        postId,
                    },
                },
            },
        });
    }

    async getPostLikes(postId: number): Promise<Like[]> {
        return await this.prisma.like.findMany({
            where: {
                postId,
            },
        });
    }

    async createPostLike(
        postId: number,
        user: User,
        createLikeDto: CreateLikeDto,
    ): Promise<Like> {
        const post = await this.findOne(postId);

        if (!post || post.status === Status.INACTIVE) {
            throw new ForbiddenException('Post is missing or inactive');
        }

        const like = await this.prisma.like.findFirst({
            where: {
                authorId: user.id,
                postId,
            },
        });

        if (like) {
            throw new BadRequestException("You've already liked this post");
        }

        const increment = createLikeDto.type === LikeType.LIKE ? 1 : -1;
        const [newLike] = await this.prisma.$transaction([
            this.prisma.like.create({
                data: {
                    authorId: user.id,
                    postId,
                    type: createLikeDto.type,
                },
            }),
            this.prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    rating: {
                        increment,
                    },
                },
            }),
        ]);

        return newLike;
    }

    async update(
        postId: number,
        user: User,
        updatePostDto: UpdatePostDto,
    ): Promise<Post> {
        const post = await this.findOne(postId);

        if (!post) {
            throw new ForbiddenException('Post is missing');
        }

        if (post.authorId !== user.id && user.role !== Role.ADMIN) {
            throw new ForbiddenException('Forbidden to update post');
        }

        for (let categoryId of updatePostDto.categories) {
            const category = await this.prisma.category.findUnique({
                where: {
                    id: categoryId,
                },
            });

            if (!category) {
                throw new NotFoundException(
                    `Category with id ${categoryId} doesn't exist`,
                );
            }
        }

        return this.prisma.post.update({
            where: {
                id: postId,
            },
            data: {
                ...updatePostDto,
                categories: {
                    create: updatePostDto.categories.map((id) => ({
                        category: {
                            connect: {
                                id,
                            },
                        },
                    })),
                },
            },
        });
    }

    async remove(postId: number, user: User): Promise<Post> {
        const post = await this.findOne(postId);

        if (!post) {
            throw new ForbiddenException('Post is missing');
        }

        if (post.authorId !== user.id && user.role !== Role.ADMIN) {
            throw new ForbiddenException('Forbidden to update post');
        }

        return await this.prisma.post.delete({
            where: {
                id: postId,
            },
        });
    }

    async removePostLike(postId: number, user: User): Promise<Like> {
        const post = await this.findOne(postId);

        if (!post || post.status === Status.INACTIVE) {
            throw new ForbiddenException('Post is missing or inactive');
        }

        const like = await this.prisma.like.findFirst({
            where: {
                authorId: user.id,
                postId,
            },
        });

        if (!like) {
            throw new BadRequestException('Like not found');
        }

        const increment = like.type === LikeType.LIKE ? -1 : 1;
        const [deletedLike] = await this.prisma.$transaction([
            this.prisma.like.delete({
                where: {
                    id: like.id,
                },
            }),
            this.prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    rating: {
                        increment,
                    },
                },
            }),
        ]);

        return deletedLike;
    }
}
