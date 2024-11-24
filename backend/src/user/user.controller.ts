import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    ParseIntPipe,
    Request,
    UseInterceptors,
    UploadedFile,
    Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserEntity } from './dto/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/decorators/public.decorator';
import { multerOptions } from 'src/config/multer.config';
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
    ApiTags,
} from '@nestjs/swagger';
import { PaginationOptionsDto } from 'src/post/dto/pagination-options.dto';
import { Paginated } from 'src/post/dto/paginated';
import { ApiPaginatedResponse } from 'src/post/dto/api-paginated-response';
import { FileUploadDto } from './dto/file-upload.dto';

@ApiBearerAuth()
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: 'Create user' })
    @ApiBody({ type: CreateUserDto })
    @ApiCreatedResponse({ type: UserEntity })
    @ApiBadRequestResponse({ description: 'User already exists' })
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
        return this.userService.create(createUserDto);
    }

    @ApiOperation({ summary: 'Get all users' })
    @ApiPaginatedResponse(UserEntity, 'Paginated list of users')
    @Get()
    findAll(
        @Query() paginationOptions: PaginationOptionsDto,
    ): Promise<Paginated<UserEntity>> {
        return this.userService.findAll(paginationOptions);
    }

    @ApiOperation({ summary: 'Get user by id' })
    @ApiParam({
        name: 'id',
        description: 'user id',
    })
    @ApiOkResponse({ type: UserEntity })
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
        return this.userService.findOne(id);
    }

    @ApiOperation({ summary: 'Upload user avatar' })
    @ApiBody({ type: FileUploadDto })
    @ApiCreatedResponse({ type: UserEntity })
    @ApiBadRequestResponse({ description: 'Invalid file' })
    @ApiInternalServerErrorResponse({ description: 'Failed to delete file' })
    @UseInterceptors(FileInterceptor('avatar', multerOptions))
    @Patch('avatar')
    uploadAvatar(
        @Request() req,
        @UploadedFile() avatar: Express.Multer.File,
    ): Promise<UserEntity> {
        return this.userService.uploadAvatar(req.user, avatar);
    }

    @ApiOperation({ summary: 'Update user' })
    @ApiParam({
        name: 'id',
        description: 'user id',
    })
    @ApiBody({ type: CreateUserDto })
    @ApiOkResponse({ type: UserEntity })
    @ApiBadRequestResponse({ description: 'User already exists' })
    @ApiForbiddenResponse({ description: 'No permission to update user' })
    @Patch(':id')
    update(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserEntity> {
        return this.userService.update(id, req.user, updateUserDto);
    }

    @ApiOperation({ summary: 'Delete user' })
    @ApiParam({
        name: 'id',
        description: 'user id',
    })
    @ApiOkResponse({ type: UserEntity })
    @ApiForbiddenResponse({ description: 'No permission to update user' })
    @Delete(':id')
    remove(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<UserEntity> {
        return this.userService.remove(id, req.user);
    }
}
