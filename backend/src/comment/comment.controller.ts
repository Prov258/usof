import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Request,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CreateLikeDto } from 'src/post/dto/create-like.dto';
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
import { CommentEntity } from './entities/comment.entity';
import { LikeEntity } from 'src/like/entities/like.entity';
import { CurrentUser } from 'src/decorators/user.decorator';
import { User } from '@prisma/client';

@ApiBearerAuth()
@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @ApiOperation({ summary: 'Get comment by id' })
    @ApiParam({
        name: 'id',
        description: 'comment id',
    })
    @ApiOkResponse({ type: CommentEntity })
    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.commentService.findOne(id);
    }

    @ApiOperation({ summary: 'Get all likes for comment' })
    @ApiParam({
        name: 'id',
        description: 'comment id',
    })
    @ApiOkResponse({ type: [LikeEntity] })
    @ApiNotFoundResponse({ description: "Comment doesn't exist" })
    @Get(':id/like')
    getCommentLikes(@Param('id') id: number) {
        return this.commentService.getCommentLikes(id);
    }

    @ApiOperation({ summary: 'Like comment' })
    @ApiParam({
        name: 'id',
        description: 'comment id',
    })
    @ApiBody({ type: CreateLikeDto })
    @ApiCreatedResponse({ type: LikeEntity })
    @ApiNotFoundResponse({ description: "Comment doesn't exist" })
    @ApiBadRequestResponse({ description: "You've already liked this comment" })
    @Post(':id/like')
    createCommentLike(
        @CurrentUser() user: User,
        @Param('id') id: number,
        @Body() createLikeDto: CreateLikeDto,
    ) {
        return this.commentService.createCommentLike(id, user, createLikeDto);
    }

    @ApiOperation({ summary: 'Update comment' })
    @ApiParam({
        name: 'id',
        description: 'comment id',
    })
    @ApiBody({ type: CreateCommentDto })
    @ApiOkResponse({ type: CommentEntity })
    @ApiNotFoundResponse({ description: "Comment doesn't exist" })
    @ApiForbiddenResponse({ description: 'Forbidden to update comment' })
    @Patch(':id')
    update(
        @CurrentUser() user: User,
        @Param('id') id: number,
        @Body() updateCommentDto: UpdateCommentDto,
    ) {
        return this.commentService.update(id, user, updateCommentDto);
    }

    @ApiOperation({ summary: 'Delete comment' })
    @ApiParam({
        name: 'id',
        description: 'comment id',
    })
    @ApiOkResponse({ type: CommentEntity })
    @ApiNotFoundResponse({ description: "Comment doesn't exist" })
    @ApiForbiddenResponse({ description: 'Forbidden to delete comment' })
    @Delete(':id')
    remove(@CurrentUser() user: User, @Param('id') id: number) {
        return this.commentService.remove(id, user);
    }

    @ApiOperation({ summary: 'Remove like from comment' })
    @ApiParam({
        name: 'id',
        description: 'comment id',
    })
    @ApiOkResponse({ type: LikeEntity })
    @ApiNotFoundResponse({ description: "Comment doesn't exist" })
    @Delete(':id/like')
    removeCommentLike(@CurrentUser() user: User, @Param('id') id: number) {
        return this.commentService.removeCommentLike(id, user);
    }
}
