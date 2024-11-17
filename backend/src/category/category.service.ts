import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationOptionsDto } from 'src/post/dto/pagination-options.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Paginated } from 'src/post/dto/paginated';
import { Category, Post, Prisma } from '@prisma/client';

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

        const pageCount = Math.ceil(count / limit);

        return {
            data: categories,
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

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const category = await this.prisma.category.findUnique({
            where: {
                title: createCategoryDto.title,
            },
        });

        if (category) {
            throw new BadRequestException(
                'Category with such title already exist',
            );
        }

        return await this.prisma.category.create({
            data: createCategoryDto,
        });
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto) {
        const category = await this.prisma.category.findUnique({
            where: {
                id,
            },
        });

        if (!category) {
            throw new BadRequestException("Category doesn't exist");
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
                    'Category with such title already exist',
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

    async remove(id: number) {
        const category = await this.prisma.category.findUnique({
            where: {
                id,
            },
        });

        if (!category) {
            throw new BadRequestException("Category doesn't exist");
        }

        return await this.prisma.category.delete({
            where: {
                id,
            },
        });
    }
}
