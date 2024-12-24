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
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { PaginationOptionsDto } from 'src/shared/pagination/pagination-options.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
    ApiCategoryCreate,
    ApiCategoryFindAll,
    ApiCategoryFindOne,
    ApiCategoryGetPosts,
    ApiCategoryRemove,
    ApiCategoryUpdate,
} from './decorators/api-category.decorator';

@ApiBearerAuth()
@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @ApiCategoryFindAll()
    @Get()
    findAll(@Query() paginationOptions: PaginationOptionsDto) {
        return this.categoryService.findAll(paginationOptions);
    }

    @ApiCategoryFindOne()
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.categoryService.findOne(id);
    }

    @ApiCategoryGetPosts()
    @Get(':id/posts')
    getCategoryPosts(
        @Param('id') id: number,
        @Query() paginationOptions: PaginationOptionsDto,
    ) {
        return this.categoryService.getCategoryPosts(id, paginationOptions);
    }

    @ApiCategoryCreate()
    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }

    @ApiCategoryUpdate()
    @Patch(':id')
    update(
        @Param('id') id: number,
        @Body() updateCategoryDto: UpdateCategoryDto,
    ) {
        return this.categoryService.update(id, updateCategoryDto);
    }

    @ApiCategoryRemove()
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.categoryService.remove(id);
    }
}
