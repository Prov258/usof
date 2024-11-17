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

@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.commentService.findOne(id);
    }

    @Get(':id/like')
    getCommentLikes(@Param('id') id: number) {
        return this.commentService.getCommentLikes(id);
    }

    @Post(':id/like')
    createCommentLike(
        @Request() req,
        @Param('id') id: number,
        @Body() createLikeDto: CreateLikeDto,
    ) {
        return this.commentService.createCommentLike(
            id,
            req.user,
            createLikeDto,
        );
    }

    @Patch(':id')
    update(
        @Request() req,
        @Param('id') id: number,
        @Body() updateCommentDto: UpdateCommentDto,
    ) {
        return this.commentService.update(id, req.user, updateCommentDto);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: number) {
        return this.commentService.remove(id, req.user);
    }

    @Delete(':id/like')
    removeCommentLike(@Request() req, @Param('id') id: number) {
        return this.commentService.removeCommentLike(id, req.user);
    }
}
