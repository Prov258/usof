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
    UseInterceptors,
    UploadedFile,
    Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role, User } from '@prisma/client';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserEntity } from './entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';
import { PaginationOptionsDto } from 'src/shared/pagination/pagination-options.dto';
import { Paginated } from 'src/shared/pagination/paginated';
import { CurrentUser } from 'src/shared/decorators/user.decorator';
import {
    ApiUserCreate,
    ApiUserFindAll,
    ApiUserFindOne,
    ApiUserRemove,
    ApiUserUpdate,
    ApiUserUploadAvatar,
} from './decorators/api-user.decorator';
import { Public } from 'src/shared/decorators/public.decorator';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiUserCreate()
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
        return this.userService.create(createUserDto);
    }

    @ApiUserFindAll()
    @Public()
    @Get()
    findAll(
        @Query() paginationOptions: PaginationOptionsDto,
    ): Promise<Paginated<UserEntity>> {
        return this.userService.findAll(paginationOptions);
    }

    @ApiUserFindOne()
    @Public()
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
        return this.userService.findOne(id);
    }

    @ApiUserUploadAvatar()
    @UseInterceptors(FileInterceptor('avatar', multerOptions))
    @Patch('avatar')
    uploadAvatar(
        @CurrentUser() user: User,
        @UploadedFile() avatar: Express.Multer.File,
    ): Promise<UserEntity> {
        return this.userService.uploadAvatar(user, avatar);
    }

    @ApiUserUpdate()
    @Patch(':id')
    update(
        @CurrentUser() user: User,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserEntity> {
        return this.userService.update(id, user, updateUserDto);
    }

    @ApiUserRemove()
    @Delete(':id')
    remove(
        @CurrentUser() user: User,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<UserEntity> {
        return this.userService.remove(id, user);
    }
}
