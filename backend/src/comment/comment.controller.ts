import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { UpdateCommentDto } from './dto';
import { CreateLikeDto } from 'src/like/dto/create-like.dto';
import { CurrentUser } from 'src/shared/decorators/user.decorator';
import { Comment, Like, User } from '@prisma/client';
import {
    ApiCommentCreateLike,
    ApiCommentFindOne,
    ApiCommentGetLikes,
    ApiCommentRemove,
    ApiCommentRemoveLike,
    ApiCommentUpdate,
} from './decorators/api-comment.decorator';
import { Public } from 'src/shared/decorators/public.decorator';

@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @ApiCommentFindOne()
    @Public()
    @Get(':id')
    findOne(@Param('id') id: number): Promise<Comment> {
        return this.commentService.findOne(id);
    }

    @ApiCommentGetLikes()
    @Public()
    @Get(':id/like')
    getCommentLikes(@Param('id') id: number): Promise<Like[]> {
        return this.commentService.getCommentLikes(id);
    }

    @ApiCommentCreateLike()
    @Post(':id/like')
    createCommentLike(
        @CurrentUser() user: User,
        @Param('id') id: number,
        @Body() createLikeDto: CreateLikeDto,
    ): Promise<Like> {
        return this.commentService.createCommentLike(id, user, createLikeDto);
    }

    @ApiCommentUpdate()
    @Patch(':id')
    update(
        @CurrentUser() user: User,
        @Param('id') id: number,
        @Body() updateCommentDto: UpdateCommentDto,
    ): Promise<Comment> {
        return this.commentService.update(id, user, updateCommentDto);
    }

    @ApiCommentRemove()
    @Delete(':id')
    remove(
        @CurrentUser() user: User,
        @Param('id') id: number,
    ): Promise<Comment> {
        return this.commentService.remove(id, user);
    }

    @ApiCommentRemoveLike()
    @Delete(':id/like')
    removeCommentLike(
        @CurrentUser() user: User,
        @Param('id') id: number,
    ): Promise<Like> {
        return this.commentService.removeCommentLike(id, user);
    }
}
