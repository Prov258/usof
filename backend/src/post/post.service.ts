import {
    BadRequestException,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import {
    CreatePostDto,
    UpdatePostDto,
    SortingOptionsDto,
    FilteringOptionsDto,
} from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginationOptionsDto } from 'src/shared/pagination/pagination-options.dto';
import { Paginated } from 'src/shared/pagination/paginated';
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
import { CreateLikeDto } from 'src/like/dto/create-like.dto';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class PostService {
    constructor(
        private prisma: PrismaService,
        private categorySevice: CategoryService,
    ) {}

    async create(user: User, createPostDto: CreatePostDto): Promise<Post> {
        await this.categorySevice.validateCategories(createPostDto.categories);

        return await this.prisma.post.create({
            data: {
                authorId: user.id,
                ...createPostDto,
                categories: {
                    create: createPostDto.categories.map((title) => ({
                        category: {
                            connect: {
                                title,
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
            authorId,
            title,
        }: FilteringOptionsDto,
        user?: User,
    ): Promise<Paginated<Post>> {
        const where: Prisma.PostWhereInput = {
            AND: [
                ...(categories
                    ? [
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
                      ]
                    : []),
                {
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
                {
                    title: {
                        contains: title,
                        mode: 'insensitive',
                    },
                },
                {
                    authorId,
                },
                {
                    status: user?.role === Role.ADMIN ? status : Status.ACTIVE,
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
                    author: true,
                    likes: user
                        ? {
                              where: { authorId: user.id },
                          }
                        : false,
                },
            }),
            this.prisma.post.count({ where }),
        ]);

        const pageCount = Math.ceil(count / limit);

        return {
            data: posts.map((post) => ({
                ...post,
                categories: post.categories.map(({ category }) => category),
                likes: post.likes?.[0]?.type ?? null,
            })),
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

    async findOne(
        id: number,
        user?: User,
    ): Promise<
        Post & { categories: Partial<Category>[] } & { likes: LikeType | null }
    > {
        // fix this typing mess
        const post = await this.prisma.post.findUnique({
            where: {
                id,
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
                author: true,
                likes: user
                    ? {
                          where: { authorId: user.id },
                      }
                    : false,
            },
        });

        return {
            ...post,
            categories: post.categories.map((c) => c.category),
            likes: post.likes?.[0]?.type ?? null,
        };
    }

    async findComments(
        postId: number,
        { page, limit }: PaginationOptionsDto,
        user?: User,
    ) {
        const where: Prisma.CommentWhereInput = {
            postId,
        };

        const [comments, count] = await this.prisma.$transaction([
            this.prisma.comment.findMany({
                where,
                take: limit,
                skip: limit * (page - 1),
                include: {
                    author: true,
                    likes: user
                        ? {
                              where: { authorId: user.id },
                          }
                        : false,
                },
            }),
            this.prisma.comment.count({ where }),
        ]);

        const pageCount = Math.ceil(count / limit);

        return {
            data: comments.map((comment) => ({
                ...comment,
                likes: comment.likes?.[0]?.type ?? null,
            })),
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
            include: {
                author: true,
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
        const [_, newLike] = await this.prisma.$transaction([
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
            this.prisma.like.create({
                data: {
                    authorId: user.id,
                    postId,
                    type: createLikeDto.type,
                },
                include: {
                    post: true,
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

        await this.categorySevice.validateCategories(updatePostDto.categories);

        return this.prisma.post.update({
            where: {
                id: postId,
            },
            data: {
                ...updatePostDto,
                categories: {
                    deleteMany: {},
                    create: updatePostDto.categories.map((title) => ({
                        category: {
                            connect: {
                                title,
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
        const [_, deletedLike] = await this.prisma.$transaction([
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
            this.prisma.like.delete({
                where: {
                    id: like.id,
                },
                include: {
                    post: true,
                },
            }),
        ]);

        return deletedLike;
    }
}
