import { applyDecorators } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
} from '@nestjs/swagger';
import { CreateUserDto, FileUploadDto } from '../dto';
import { UserEntity } from '../entities/user.entity';
import { ApiPaginatedResponse } from 'src/shared/pagination/api-paginated-response';

export const ApiUserCreate = () =>
    applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: 'Create user' }),
        ApiBody({ type: CreateUserDto }),
        ApiCreatedResponse({ type: UserEntity }),
        ApiBadRequestResponse({ description: 'User already exists' }),
    );

export const ApiUserFindAll = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get all users' }),
        ApiPaginatedResponse(UserEntity, 'Paginated list of users'),
    );

export const ApiUserFindOne = () =>
    applyDecorators(
        ApiOperation({ summary: 'Get user by id' }),
        ApiParam({
            name: 'id',
            description: 'user id',
        }),
        ApiOkResponse({ type: UserEntity }),
    );

export const ApiUserUploadAvatar = () =>
    applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: 'Upload user avatar' }),
        ApiBody({ type: FileUploadDto }),
        ApiCreatedResponse({ type: UserEntity }),
        ApiBadRequestResponse({ description: 'Invalid file' }),
        ApiInternalServerErrorResponse({
            description: 'Failed to delete file',
        }),
    );

export const ApiUserUpdate = () =>
    applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: 'Update user' }),
        ApiParam({
            name: 'id',
            description: 'user id',
        }),
        ApiBody({ type: CreateUserDto }),
        ApiOkResponse({ type: UserEntity }),
        ApiBadRequestResponse({ description: 'User already exists' }),
        ApiForbiddenResponse({ description: 'No permission to update user' }),
    );

export const ApiUserRemove = () =>
    applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: 'Delete user' }),
        ApiParam({
            name: 'id',
            description: 'user id',
        }),
        ApiOkResponse({ type: UserEntity }),
        ApiForbiddenResponse({ description: 'No permission to update user' }),
    );
