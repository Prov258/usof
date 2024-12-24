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
import { CreateCommentDto, UpdateCommentDto } from './dto';
import { CreateLikeDto } from 'src/like/dto/create-like.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/decorators/user.decorator';
import { User } from '@prisma/client';
import {
    ApiCommentCreateLike,
    ApiCommentFindOne,
    ApiCommentGetLikes,
    ApiCommentRemove,
    ApiCommentRemoveLike,
    ApiCommentUpdate,
} from './decorators/api-comment.decorator';

@ApiBearerAuth()
@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @ApiCommentFindOne()
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.commentService.findOne(id);
    }

    @ApiCommentGetLikes()
    @Get(':id/like')
    getCommentLikes(@Param('id') id: number) {
        return this.commentService.getCommentLikes(id);
    }

    @ApiCommentCreateLike()
    @Post(':id/like')
    createCommentLike(
        @CurrentUser() user: User,
        @Param('id') id: number,
        @Body() createLikeDto: CreateLikeDto,
    ) {
        return this.commentService.createCommentLike(id, user, createLikeDto);
    }

    @ApiCommentUpdate()
    @Patch(':id')
    update(
        @CurrentUser() user: User,
        @Param('id') id: number,
        @Body() updateCommentDto: UpdateCommentDto,
    ) {
        return this.commentService.update(id, user, updateCommentDto);
    }

    @ApiCommentRemove()
    @Delete(':id')
    remove(@CurrentUser() user: User, @Param('id') id: number) {
        return this.commentService.remove(id, user);
    }

    @ApiCommentRemoveLike()
    @Delete(':id/like')
    removeCommentLike(@CurrentUser() user: User, @Param('id') id: number) {
        return this.commentService.removeCommentLike(id, user);
    }
}
