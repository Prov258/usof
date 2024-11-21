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
    Favorite,
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
import { SortingOptionsDto } from './dto/sorting-options.dto';
import { FilteringOptionsDto } from './dto/filtering-options.dto';

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
        { order, sort }: SortingOptionsDto,
        {
            status,
            categories,
            startDate,
            endDate,
            favorite,
        }: FilteringOptionsDto,
        user: User,
    ): Promise<Paginated<Post>> {
        const where: Prisma.PostWhereInput = {
            AND: [
                {
                    categories: {
                        some: {
                            category: {
                                title: {
                                    in: categories,
                                },
                            },
                        },
                    },
                },
                {
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
                {
                    status: user.role === Role.ADMIN ? status : Status.ACTIVE,
                },
                ...(favorite
                    ? [
                          {
                              favorites: {
                                  some: {
                                      userId: user.id,
                                  },
                              },
                          },
                      ]
                    : []),
            ],
        };

        const [posts, count] = await this.prisma.$transaction([
            this.prisma.post.findMany({
                where,
                take: limit,
                skip: limit * (page - 1),
                orderBy: {
                    [sort]: order,
                },
                include: {
                    categories: {
                        select: {
                            category: {
                                select: {
                                    id: true,
                                    title: true,
                                },
                            },
                        },
                    },
                },
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
            this.prisma.post.update({
                where: {
                    id: postId,
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
        ]);

        return newLike;
    }

    async createPostFavorite(postId: number, user: User): Promise<Favorite> {
        const post = await this.findOne(postId);

        if (!post || post.status === Status.INACTIVE) {
            throw new ForbiddenException('Post is missing or inactive');
        }

        const favorite = await this.prisma.favorite.findFirst({
            where: {
                userId: user.id,
                postId,
            },
        });

        if (favorite) {
            throw new BadRequestException(
                "You've already added this post to favorite",
            );
        }

        return await this.prisma.favorite.create({
            data: {
                userId: user.id,
                postId,
            },
        });
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

    async removePostFavorite(postId: number, user: User): Promise<Favorite> {
        const post = await this.findOne(postId);

        if (!post || post.status === Status.INACTIVE) {
            throw new ForbiddenException('Post is missing or inactive');
        }

        const favorite = await this.prisma.favorite.findFirst({
            where: {
                userId: user.id,
                postId,
            },
        });

        if (!favorite) {
            throw new BadRequestException("Post isn't in your favorites");
        }

        return await this.prisma.favorite.delete({
            where: {
                id: favorite.id,
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
            this.prisma.post.update({
                where: {
                    id: postId,
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
        ]);

        return deletedLike;
    }
}
