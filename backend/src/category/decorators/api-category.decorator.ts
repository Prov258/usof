import { applyDecorators } from '@nestjs/common';
import { CategoryEntity } from '../entities/category.entity';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/shared/pagination/api-paginated-response';
import { PostEntity } from 'src/post/entities/post.entity';
import { CreateCategoryDto } from '../dto';

export const ApiCategoryFindAll = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get all categories' }),
        ApiPaginatedResponse(CategoryEntity, 'Paginated list of categories'),
    );

export const ApiCategoryFindOne = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get category by id' }),
        ApiParam({
            name: 'id',
            description: 'category id',
        }),
        ApiOkResponse({ type: CategoryEntity }),
    );

export const ApiCategoryGetPosts = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get posts by category' }),
        ApiParam({
            name: 'id',
            description: 'category id',
        }),
        ApiPaginatedResponse(PostEntity, 'Paginated list of posts'),
    );

export const ApiCategoryCreate = () =>
    applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: 'Create category' }),
        ApiBody({ type: CreateCategoryDto }),
        ApiCreatedResponse({ type: CategoryEntity }),
        ApiBadRequestResponse({
            description: 'Category with such title already exists',
        }),
    );

export const ApiCategoryUpdate = () =>
    applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: 'Update category' }),
        ApiParam({
            name: 'id',
            description: 'category id',
        }),
        ApiBody({ type: CreateCategoryDto }),
        ApiOkResponse({ type: CategoryEntity }),
        ApiNotFoundResponse({ description: "Category doesn't exist" }),
        ApiBadRequestResponse({
            description: 'Category with such title already exists',
        }),
    );

export const ApiCategoryRemove = () =>
    applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: 'Delete category' }),
        ApiParam({
            name: 'id',
            description: 'category id',
        }),
        ApiOkResponse({ type: CategoryEntity }),
        ApiNotFoundResponse({ description: "Category doesn't exist" }),
    );
