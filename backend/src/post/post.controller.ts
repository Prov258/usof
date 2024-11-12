import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    Request,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Public } from 'src/decorators/public.decorator';
import { PaginationOptionsDto } from './dto/pagination-options.dto';

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Get()
    findAll(@Request() req, @Query() paginationOptions: PaginationOptionsDto) {
        return this.postService.findAll(paginationOptions, req.user);
    }

    @Public()
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.postService.findOne(id);
    }

    @Public()
    @Get(':id/comments')
    getPostComments(
        @Param('id') id: number,
        @Query() paginationOptions: PaginationOptionsDto,
    ) {
        return this.postService.findComments(id, paginationOptions);
    }

    @Post(':id/comments')
    createPostComment() {}

    @Post()
    createPost(@Body() createPostDto: CreatePostDto) {
        return this.postService.create(createPostDto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
        return this.postService.update(+id, updatePostDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.postService.remove(+id);
    }
}
