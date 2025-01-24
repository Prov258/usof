import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { PaginationOptionsDto } from 'src/shared/pagination/pagination-options.dto';
import {
    ApiCategoryCreate,
    ApiCategoryFindAll,
    ApiCategoryFindOne,
    ApiCategoryGetPosts,
    ApiCategoryRemove,
    ApiCategoryUpdate,
} from './decorators/api-category.decorator';
import { Public } from 'src/shared/decorators/public.decorator';
import { Paginated } from 'src/shared/pagination/paginated';
import { Category, Post as PostType, Role } from '@prisma/client';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @ApiCategoryFindAll()
    @Public()
    @Get()
    findAll(
        @Query() paginationOptions: PaginationOptionsDto,
    ): Promise<Paginated<Category>> {
        return this.categoryService.findAll(paginationOptions);
    }

    @ApiCategoryFindOne()
    @Public()
    @Get(':id')
    findOne(@Param('id') id: number): Promise<Category> {
        return this.categoryService.findOne(id);
    }

    @ApiCategoryGetPosts()
    @Public()
    @Get(':id/posts')
    getCategoryPosts(
        @Param('id') id: number,
        @Query() paginationOptions: PaginationOptionsDto,
    ): Promise<Paginated<PostType>> {
        return this.categoryService.getCategoryPosts(id, paginationOptions);
    }

    @ApiCategoryCreate()
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
        return this.categoryService.create(createCategoryDto);
    }

    @ApiCategoryUpdate()
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @Patch(':id')
    update(
        @Param('id') id: number,
        @Body() updateCategoryDto: UpdateCategoryDto,
    ): Promise<Category> {
        return this.categoryService.update(id, updateCategoryDto);
    }

    @ApiCategoryRemove()
    @Roles(Role.ADMIN)
    @UseGuards(RolesGuard)
    @Delete(':id')
    remove(@Param('id') id: number): Promise<Category> {
        return this.categoryService.remove(id);
    }
}
