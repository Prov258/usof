import { applyDecorators } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
} from '@nestjs/swagger';
import { CommentEntity } from '../entities/comment.entity';
import { LikeEntity } from 'src/like/entities/like.entity';
import { CreateLikeDto } from 'src/like/dto/create-like.dto';
import { CreateCommentDto } from '../dto';

export const ApiCommentFindOne = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get comment by id' }),
        ApiParam({
            name: 'id',
            description: 'comment id',
        }),
        ApiOkResponse({ type: CommentEntity }),
    );

export const ApiCommentGetLikes = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get all likes for comment' }),
        ApiParam({
            name: 'id',
            description: 'comment id',
        }),
        ApiOkResponse({ type: [LikeEntity] }),
        ApiNotFoundResponse({ description: "Comment doesn't exist" }),
    );

export const ApiCommentCreateLike = () =>
    applyDecorators(
        ApiOperation({ summary: 'Like comment' }),
        ApiParam({
            name: 'id',
            description: 'comment id',
        }),
        ApiBody({ type: CreateLikeDto }),
        ApiCreatedResponse({ type: LikeEntity }),
        ApiNotFoundResponse({ description: "Comment doesn't exist" }),
        ApiBadRequestResponse({
            description: "You've already liked this comment",
        }),
    );

export const ApiCommentUpdate = () =>
    applyDecorators(
        ApiOperation({ summary: 'Update comment' }),
        ApiParam({
            name: 'id',
            description: 'comment id',
        }),
        ApiBody({ type: CreateCommentDto }),
        ApiOkResponse({ type: CommentEntity }),
        ApiNotFoundResponse({ description: "Comment doesn't exist" }),
        ApiForbiddenResponse({ description: 'Forbidden to update comment' }),
    );

export const ApiCommentRemove = () =>
    applyDecorators(
        ApiOperation({ summary: 'Delete comment' }),
        ApiParam({
            name: 'id',
            description: 'comment id',
        }),
        ApiOkResponse({ type: CommentEntity }),
        ApiNotFoundResponse({ description: "Comment doesn't exist" }),
        ApiForbiddenResponse({ description: 'Forbidden to delete comment' }),
    );

export const ApiCommentRemoveLike = () =>
    applyDecorators(
        ApiOperation({ summary: 'Remove like from comment' }),
        ApiParam({
            name: 'id',
            description: 'comment id',
        }),
        ApiOkResponse({ type: LikeEntity }),
        ApiNotFoundResponse({ description: "Comment doesn't exist" }),
    );
