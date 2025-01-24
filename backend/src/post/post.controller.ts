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
import { PostService } from './post.service';
import {
    CreatePostDto,
    UpdatePostDto,
    SortingOptionsDto,
    FilteringOptionsDto,
} from './dto';
import { Public } from 'src/shared/decorators/public.decorator';
import { PaginationOptionsDto } from 'src/shared/pagination/pagination-options.dto';
import { CreateCommentDto } from 'src/comment/dto/create-comment.dto';
import { CreateLikeDto } from 'src/like/dto/create-like.dto';
import {
    User,
    Post as PostType,
    Comment,
    Category,
    Like,
    Favorite,
} from '@prisma/client';
import { CurrentUser } from 'src/shared/decorators/user.decorator';
import {
    ApiPostCreate,
    ApiPostCreateComment,
    ApiPostCreateFavorite,
    ApiPostCreateLike,
    ApiPostFindAll,
    ApiPostFindOne,
    ApiPostGetCategories,
    ApiPostGetComments,
    ApiPostGetLikes,
    ApiPostRemove,
    ApiPostRemoveFavorite,
    ApiPostRemoveLike,
    ApiPostUpdate,
} from './decorators/api-post.decorator';
import { Paginated } from 'src/shared/pagination/paginated';

@Controller('posts')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @ApiPostFindAll()
    @Public()
    @Get()
    findAll(
        @CurrentUser() user: User,
        @Query() sortingOptions: SortingOptionsDto,
        @Query() filteringOptions: FilteringOptionsDto,
        @Query() paginationOptions: PaginationOptionsDto,
    ): Promise<Paginated<PostType>> {
        return this.postService.findAll(
            paginationOptions,
            sortingOptions,
            filteringOptions,
            user,
        );
    }

    @ApiPostFindOne()
    @Public()
    @Get(':id')
    findOne(@CurrentUser() user: User, @Param('id') id: number) {
        return this.postService.findOne(id, user);
    }

    @ApiPostGetComments()
    @Public()
    @Get(':id/comments')
    getPostComments(
        @CurrentUser() user: User,
        @Param('id') id: number,
        @Query() paginationOptions: PaginationOptionsDto,
    ): Promise<Paginated<Comment>> {
        return this.postService.findComments(id, paginationOptions, user);
    }

    @ApiPostCreateComment()
    @Post(':id/comments')
    createPostComment(
        @Param('id') id: number,
        @CurrentUser() user: User,
        @Body() createCommentDto: CreateCommentDto,
    ): Promise<Comment> {
        return this.postService.createPostComment(id, user, createCommentDto);
    }

    @ApiPostGetCategories()
    @Public()
    @Get(':id/categories')
    getPostCategories(@Param('id') id: number): Promise<Category[]> {
        return this.postService.getPostCategories(id);
    }

    @ApiPostGetLikes()
    @Public()
    @Get(':id/like')
    getPostLikes(@Param('id') id: number): Promise<Like[]> {
        return this.postService.getPostLikes(id);
    }

    @ApiPostCreate()
    @Post()
    createPost(
        @CurrentUser() user: User,
        @Body() createPostDto: CreatePostDto,
    ): Promise<PostType> {
        return this.postService.create(user, createPostDto);
    }

    @ApiPostCreateLike()
    @Post(':id/like')
    createPostLike(
        @CurrentUser() user: User,
        @Param('id') id: number,
        @Body() createLikeDto: CreateLikeDto,
    ): Promise<Like> {
        return this.postService.createPostLike(id, user, createLikeDto);
    }

    @ApiPostCreateFavorite()
    @Post(':id/favorite')
    createPostFavorite(
        @CurrentUser() user: User,
        @Param('id') id: number,
    ): Promise<Favorite> {
        return this.postService.createPostFavorite(id, user);
    }

    @ApiPostRemoveFavorite()
    @Delete(':id/favorite')
    removePostFavorite(
        @CurrentUser() user: User,
        @Param('id') id: number,
    ): Promise<Favorite> {
        return this.postService.removePostFavorite(id, user);
    }

    @ApiPostUpdate()
    @Patch(':id')
    update(
        @CurrentUser() user: User,
        @Param('id') id: number,
        @Body() updatePostDto: UpdatePostDto,
    ): Promise<PostType> {
        return this.postService.update(id, user, updatePostDto);
    }

    @ApiPostRemove()
    @Delete(':id')
    remove(
        @CurrentUser() user: User,
        @Param('id') id: number,
    ): Promise<PostType> {
        return this.postService.remove(id, user);
    }

    @ApiPostRemoveLike()
    @Delete(':id/like')
    removePostLike(
        @CurrentUser() user: User,
        @Param('id') id: number,
    ): Promise<Like> {
        return this.postService.removePostLike(id, user);
    }
}
