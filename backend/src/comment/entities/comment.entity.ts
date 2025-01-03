import { ApiProperty } from '@nestjs/swagger';

export class CommentEntity {
    @ApiProperty({
        example: 1,
        type: Number,
    })
    id: number;

    @ApiProperty({
        example: 2,
        type: Number,
    })
    authorId: number;

    @ApiProperty({
        example: 3,
        type: Number,
    })
    postId: number;

    @ApiProperty({
        example: 'You should use margin',
        type: String,
    })
    content: string;

    @ApiProperty({
        example: '2024-11-21 16:49:11.733',
        type: String,
    })
    createdAt: Date;

    @ApiProperty({
        example: '2024-11-21 16:49:11.733',
        type: String,
    })
    updatedAt: Date;
}
