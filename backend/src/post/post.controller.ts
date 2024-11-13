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
import { CreateCommentDto } from 'src/comment/dto/create-comment.dto';
import { CreateLikeDto } from './dto/create-like.dto';

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
    createPostComment(
        @Param('id') id: number,
        @Request() req,
        @Body() createCommentDto: CreateCommentDto,
    ) {
        return this.postService.createPostComment(
            id,
            req.user,
            createCommentDto,
        );
    }

    @Get(':id/categories')
    getPostCategories(@Param('id') id: number) {
        return this.postService.getPostCategories(id);
    }

    @Get(':id/like')
    getPostLikes(@Param('id') id: number) {
        return this.postService.getPostLikes(id);
    }

    @Post()
    createPost(@Request() req, @Body() createPostDto: CreatePostDto) {
        return this.postService.create(req.user, createPostDto);
    }

    @Post(':id/like')
    createPostLike(
        @Request() req,
        @Param('id') id: number,
        @Body() createLikeDto: CreateLikeDto,
    ) {
        return this.postService.createPostLike(id, req.user, createLikeDto);
    }

    @Patch(':id')
    update(
        @Request() req,
        @Param('id') id: number,
        @Body() updatePostDto: UpdatePostDto,
    ) {
        return this.postService.update(id, req.user, updatePostDto);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: number) {
        return this.postService.remove(id, req.user);
    }

    @Delete(':id/like')
    removePostLike(@Request() req, @Param('id') id: number) {
        return this.postService.removePostLike(id, req.user);
    }
}
