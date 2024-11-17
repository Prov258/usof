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

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    findAll(@Query() paginationOptions: PaginationOptionsDto) {
        return this.categoryService.findAll(paginationOptions);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.categoryService.findOne(id);
    }

    @Get(':id/posts')
    getCategoryPosts(
        @Param('id') id: number,
        @Query() paginationOptions: PaginationOptionsDto,
    ) {
        return this.categoryService.getCategoryPosts(id, paginationOptions);
    }

    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }

    @Patch(':id')
    update(
        @Param('id') id: number,
        @Body() updateCategoryDto: UpdateCategoryDto,
    ) {
        return this.categoryService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.categoryService.remove(id);
    }
}
