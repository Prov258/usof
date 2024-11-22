import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationOptionsDto } from 'src/post/dto/pagination-options.dto';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/post/dto/api-paginated-response';
import { CategoryEntity } from './entities/category.entity';
import { PostEntity } from 'src/post/entities/post.entity';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @ApiOperation({ summary: 'Get all categories' })
    @ApiPaginatedResponse(CategoryEntity, 'Paginated list of categories')
    @Get()
    findAll(@Query() paginationOptions: PaginationOptionsDto) {
        return this.categoryService.findAll(paginationOptions);
    }

    @ApiOperation({ summary: 'Get category by id' })
    @ApiParam({
        name: 'id',
        description: 'category id',
    })
    @ApiOkResponse({ type: CategoryEntity })
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.categoryService.findOne(id);
    }

    @ApiOperation({ summary: 'Get posts by category' })
    @ApiParam({
        name: 'id',
        description: 'category id',
    })
    @ApiPaginatedResponse(PostEntity, 'Paginated list of posts')
    @Get(':id/posts')
    getCategoryPosts(
        @Param('id') id: number,
        @Query() paginationOptions: PaginationOptionsDto,
    ) {
        return this.categoryService.getCategoryPosts(id, paginationOptions);
    }

    @ApiOperation({ summary: 'Create category' })
    @ApiBody({ type: CreateCategoryDto })
    @ApiCreatedResponse({ type: CategoryEntity })
    @ApiBadRequestResponse({
        description: 'Category with such title already exists',
    })
    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }

    @ApiOperation({ summary: 'Update category' })
    @ApiParam({
        name: 'id',
        description: 'category id',
    })
    @ApiBody({ type: CreateCategoryDto })
    @ApiOkResponse({ type: CategoryEntity })
    @ApiNotFoundResponse({ description: "Category doesn't exist" })
    @ApiBadRequestResponse({
        description: 'Category with such title already exists',
    })
    @Patch(':id')
    update(
        @Param('id') id: number,
        @Body() updateCategoryDto: UpdateCategoryDto,
    ) {
        return this.categoryService.update(id, updateCategoryDto);
    }

    @ApiOperation({ summary: 'Delete category' })
    @ApiParam({
        name: 'id',
        description: 'category id',
    })
    @ApiOkResponse({ type: CategoryEntity })
    @ApiNotFoundResponse({ description: "Category doesn't exist" })
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.categoryService.remove(id);
    }
}
