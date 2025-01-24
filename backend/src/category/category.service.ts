import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { PaginationOptionsDto } from 'src/shared/pagination/pagination-options.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Paginated } from 'src/shared/pagination/paginated';
import { Category, Post, Prisma } from '@prisma/client';
import { getPaginationMeta } from 'src/shared/pagination/paginated-metadata';

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) {}

    async findAll({
        page,
        limit,
    }: PaginationOptionsDto): Promise<Paginated<Category>> {
        const [categories, count] = await this.prisma.$transaction([
            this.prisma.category.findMany({
                take: limit,
                skip: limit * (page - 1),
            }),
            this.prisma.category.count(),
        ]);

        return {
            data: categories,
            meta: getPaginationMeta(count, page, limit),
        };
    }

    async findOne(id: number): Promise<Category> {
        return await this.prisma.category.findUnique({
            where: {
                id,
            },
        });
    }

    async getCategoryPosts(
        id: number,
        { page, limit }: PaginationOptionsDto,
    ): Promise<Paginated<Post>> {
        const where: Prisma.PostWhereInput = {
            categories: {
                some: {
                    categoryId: id,
                },
            },
        };

        const [posts, count] = await this.prisma.$transaction([
            this.prisma.post.findMany({
                where,
                take: limit,
                skip: limit * (page - 1),
            }),
            this.prisma.post.count({ where }),
        ]);

        return {
            data: posts,
            meta: getPaginationMeta(count, page, limit),
        };
    }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const category = await this.prisma.category.findUnique({
            where: {
                title: createCategoryDto.title,
            },
        });

        if (category) {
            throw new BadRequestException(
                'Category with such title already exists',
            );
        }

        return await this.prisma.category.create({
            data: createCategoryDto,
        });
    }

    async update(
        id: number,
        updateCategoryDto: UpdateCategoryDto,
    ): Promise<Category> {
        const category = await this.prisma.category.findUnique({
            where: {
                id,
            },
        });

        if (!category) {
            throw new NotFoundException("Category doesn't exist");
        }

        if (
            updateCategoryDto.title &&
            category.title !== updateCategoryDto.title
        ) {
            const categoryByTitle = await this.prisma.category.findUnique({
                where: {
                    title: updateCategoryDto.title,
                },
            });

            if (categoryByTitle) {
                throw new BadRequestException(
                    'Category with such title already exists',
                );
            }
        }

        return await this.prisma.category.update({
            where: {
                id,
            },
            data: updateCategoryDto,
        });
    }

    async remove(id: number): Promise<Category> {
        const category = await this.prisma.category.findUnique({
            where: {
                id,
            },
        });

        if (!category) {
            throw new NotFoundException("Category doesn't exist");
        }

        return await this.prisma.category.delete({
            where: {
                id,
            },
        });
    }

    async validateCategories(titles: string[]) {
        const categories = await this.prisma.category.findMany({
            where: {
                title: {
                    in: titles,
                },
            },
            select: {
                title: true,
            },
        });

        const categoryTitles = new Set(categories.map((c) => c.title));
        const missingCategories = titles.filter(
            (title) => !categoryTitles.has(title),
        );

        if (missingCategories.length > 0) {
            throw new NotFoundException(
                `Categories not found [${missingCategories.join(', ')}]`,
            );
        }
    }
}
