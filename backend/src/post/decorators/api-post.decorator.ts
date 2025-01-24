import { applyDecorators } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/shared/pagination/api-paginated-response';
import { PostEntity } from '../entities/post.entity';
import { CommentEntity } from 'src/comment/entities/comment.entity';
import { CreateCommentDto } from 'src/comment/dto';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { LikeEntity } from 'src/like/entities/like.entity';
import { CreatePostDto } from '../dto';
import { CreateLikeDto } from 'src/like/dto/create-like.dto';
import { FavoriteEntity } from '../entities/favorite.entity';

export const ApiPostFindAll = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get all posts' }),
        ApiPaginatedResponse(PostEntity, 'Paginated list of posts'),
    );

export const ApiPostFindOne = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get post by id' }),
        ApiParam({
            name: 'id',
            description: 'post id',
        }),
        ApiOkResponse({ type: PostEntity }),
    );

export const ApiPostGetComments = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get all comments for post' }),
        ApiParam({
            name: 'id',
            description: 'post id',
        }),
        ApiPaginatedResponse(
            CommentEntity,
            'Paginated comments for post by id',
        ),
    );

export const ApiPostCreateComment = () =>
    applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: 'Create comment for post' }),
        ApiParam({
            name: 'id',
            description: 'post id',
        }),
        ApiBody({ type: CreateCommentDto }),
        ApiCreatedResponse({ type: CommentEntity }),
        ApiForbiddenResponse({ description: 'Post is missing or inactive' }),
    );

export const ApiPostGetCategories = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get all categories for post' }),
        ApiParam({
            name: 'id',
            description: 'post id',
        }),
        ApiPaginatedResponse(
            CategoryEntity,
            'Paginated categories for post by id',
        ),
    );

export const ApiPostGetLikes = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get all likes for post' }),
        ApiParam({
            name: 'id',
            description: 'post id',
        }),
        ApiOkResponse({ type: [LikeEntity] }),
    );

export const ApiPostCreate = () =>
    applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: 'Create post' }),
        ApiBody({ type: CreatePostDto }),
        ApiCreatedResponse({ type: PostEntity }),
        ApiNotFoundResponse({ description: "Category doesn't exist" }),
    );

export const ApiPostCreateLike = () =>
    applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: 'Like post' }),
        ApiParam({
            name: 'id',
            description: 'post id',
        }),
        ApiBody({ type: CreateLikeDto }),
        ApiCreatedResponse({ type: LikeEntity }),
        ApiForbiddenResponse({ description: 'Post is missing or inactive' }),
        ApiBadRequestResponse({
            description: "You've already liked this post",
        }),
    );

export const ApiPostCreateFavorite = () =>
    applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: 'Add post to favorite' }),
        ApiParam({
            name: 'id',
            description: 'post id',
        }),
        ApiCreatedResponse({ type: FavoriteEntity }),
        ApiForbiddenResponse({ description: 'Post is missing or inactive' }),
        ApiBadRequestResponse({
            description: "You've already added this post to favorite",
        }),
    );

export const ApiPostRemoveFavorite = () =>
    applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: 'Remove post from favorite' }),
        ApiParam({
            name: 'id',
            description: 'post id',
        }),
        ApiOkResponse({ type: FavoriteEntity }),
        ApiForbiddenResponse({ description: 'Post is missing or inactive' }),
        ApiBadRequestResponse({
            description: "Post isn't in your favorites",
        }),
    );

export const ApiPostUpdate = () =>
    applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: 'Update post' }),
        ApiParam({
            name: 'id',
            description: 'post id',
        }),
        ApiBody({ type: CreatePostDto }),
        ApiOkResponse({ type: PostEntity }),
        ApiForbiddenResponse({
            description: 'No permission to update post or post is missing',
        }),
        ApiNotFoundResponse({ description: "Category doesn't exist" }),
    );

export const ApiPostRemove = () =>
    applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: 'Delete post' }),
        ApiParam({
            name: 'id',
            description: 'post id',
        }),
        ApiOkResponse({ type: PostEntity }),
        ApiForbiddenResponse({
            description: 'No permission to update post or post is missing',
        }),
    );

export const ApiPostRemoveLike = () =>
    applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: 'Remove like from post' }),
        ApiParam({
            name: 'id',
            description: 'post id',
        }),
        ApiOkResponse({ type: LikeEntity }),
        ApiForbiddenResponse({ description: 'Post is missing or inactive' }),
        ApiBadRequestResponse({
            description: 'Like not found',
        }),
    );
