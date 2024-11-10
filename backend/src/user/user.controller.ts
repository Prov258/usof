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

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @Post()
    create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
        return this.userService.create(createUserDto);
    }

    @Get()
    findAll(): Promise<UserEntity[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
        return this.userService.findOne(id);
    }

    @UseInterceptors(FileInterceptor('avatar', multerOptions))
    @Patch('avatar')
    uploadAvatar(
        @Request() req,
        @UploadedFile() avatar: Express.Multer.File,
    ): Promise<UserEntity> {
        return this.userService.uploadAvatar(req.user, avatar);
    }

    @Patch(':id')
    update(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserEntity> {
        return this.userService.update(id, req.user, updateUserDto);
    }

    @Delete(':id')
    remove(
        @Request() req,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<UserEntity> {
        return this.userService.remove(id, req.user);
    }
}
