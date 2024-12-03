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
import { SortingOptionsDto } from './dto/sorting-options.dto';
import { FilteringOptionsDto } from './dto/filtering-options.dto';
import { Favorite } from '@prisma/client';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from './dto/api-paginated-response';
import { PostEntity } from './entities/post.entity';
import { CommentEntity } from 'src/comment/entities/comment.entity';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { LikeEntity } from 'src/like/entities/like.entity';
import { FavoriteEntity } from './entities/favorite.entity';

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all posts' })
    @ApiPaginatedResponse(PostEntity, 'Paginated list of posts')
    @Get()
    findAll(
        @Request() req,
        @Query() sortingOptions: SortingOptionsDto,
        @Query() filteringOptions: FilteringOptionsDto,
        @Query() paginationOptions: PaginationOptionsDto,
    ) {
        return this.postService.findAll(
            paginationOptions,
            sortingOptions,
            filteringOptions,
            req.user,
        );
    }

    @ApiOperation({ summary: 'Get post by id' })
    @ApiParam({
        name: 'id',
        description: 'post id',
    })
    @ApiOkResponse({ type: PostEntity })
    // @Public()
    @Get(':id')
    findOne(@Request() req, @Param('id') id: number) {
        return this.postService.findOne(id, req.user);
    }

    @ApiOperation({ summary: 'Get all comments for post' })
    @ApiParam({
        name: 'id',
        description: 'post id',
    })
    @ApiPaginatedResponse(CommentEntity, 'Paginated comments for post by id')
    // @Public()
    @Get(':id/comments')
    getPostComments(
        @Request() req,
        @Param('id') id: number,
        @Query() paginationOptions: PaginationOptionsDto,
    ) {
        return this.postService.findComments(id, paginationOptions, req.user);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create comment for post' })
    @ApiParam({
        name: 'id',
        description: 'post id',
    })
    @ApiBody({ type: CreateCommentDto })
    @ApiCreatedResponse({ type: CommentEntity })
    @ApiForbiddenResponse({ description: 'Post is missing or inactive' })
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

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all categories for post' })
    @ApiParam({
        name: 'id',
        description: 'post id',
    })
    @ApiPaginatedResponse(CategoryEntity, 'Paginated categories for post by id')
    @Get(':id/categories')
    getPostCategories(@Param('id') id: number) {
        return this.postService.getPostCategories(id);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all likes for post' })
    @ApiParam({
        name: 'id',
        description: 'post id',
    })
    @ApiOkResponse({ type: [LikeEntity] })
    @Get(':id/like')
    getPostLikes(@Param('id') id: number) {
        return this.postService.getPostLikes(id);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create post' })
    @ApiBody({ type: CreatePostDto })
    @ApiCreatedResponse({ type: PostEntity })
    @ApiNotFoundResponse({ description: "Category doesn't exist" })
    @Post()
    createPost(@Request() req, @Body() createPostDto: CreatePostDto) {
        return this.postService.create(req.user, createPostDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Like post' })
    @ApiParam({
        name: 'id',
        description: 'post id',
    })
    @ApiBody({ type: CreateLikeDto })
    @ApiCreatedResponse({ type: LikeEntity })
    @ApiForbiddenResponse({ description: 'Post is missing or inactive' })
    @ApiBadRequestResponse({ description: "You've already liked this post" })
    @Post(':id/like')
    createPostLike(
        @Request() req,
        @Param('id') id: number,
        @Body() createLikeDto: CreateLikeDto,
    ) {
        return this.postService.createPostLike(id, req.user, createLikeDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Add post to favorite' })
    @ApiParam({
        name: 'id',
        description: 'post id',
    })
    @ApiCreatedResponse({ type: FavoriteEntity })
    @ApiForbiddenResponse({ description: 'Post is missing or inactive' })
    @ApiBadRequestResponse({
        description: "You've already added this post to favorite",
    })
    @Post(':id/favorite')
    createPostFavorite(@Request() req, @Param('id') id: number) {
        return this.postService.createPostFavorite(id, req.user);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Remove post from favorite' })
    @ApiParam({
        name: 'id',
        description: 'post id',
    })
    @ApiOkResponse({ type: FavoriteEntity })
    @ApiForbiddenResponse({ description: 'Post is missing or inactive' })
    @ApiBadRequestResponse({
        description: "Post isn't in your favorites",
    })
    @Delete(':id/favorite')
    removePostFavorite(@Request() req, @Param('id') id: number) {
        return this.postService.removePostFavorite(id, req.user);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update post' })
    @ApiParam({
        name: 'id',
        description: 'post id',
    })
    @ApiBody({ type: CreatePostDto })
    @ApiOkResponse({ type: PostEntity })
    @ApiForbiddenResponse({
        description: 'No permission to update post or post is missing',
    })
    @ApiNotFoundResponse({ description: "Category doesn't exist" })
    @Patch(':id')
    update(
        @Request() req,
        @Param('id') id: number,
        @Body() updatePostDto: UpdatePostDto,
    ) {
        return this.postService.update(id, req.user, updatePostDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete post' })
    @ApiParam({
        name: 'id',
        description: 'post id',
    })
    @ApiOkResponse({ type: PostEntity })
    @ApiForbiddenResponse({
        description: 'No permission to update post or post is missing',
    })
    @Delete(':id')
    remove(@Request() req, @Param('id') id: number) {
        return this.postService.remove(id, req.user);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Remove like from post' })
    @ApiParam({
        name: 'id',
        description: 'post id',
    })
    @ApiOkResponse({ type: LikeEntity })
    @ApiForbiddenResponse({ description: 'Post is missing or inactive' })
    @ApiBadRequestResponse({
        description: 'Like not found',
    })
    @Delete(':id/like')
    removePostLike(@Request() req, @Param('id') id: number) {
        return this.postService.removePostLike(id, req.user);
    }
}
