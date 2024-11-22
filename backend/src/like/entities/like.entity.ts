import { ApiProperty } from '@nestjs/swagger';
import { LikeType } from '@prisma/client';

export class LikeEntity {
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
        example: 4,
        type: Number,
    })
    commentId: number;

    @ApiProperty({
        example: 'LIKE',
        type: String,
        enum: LikeType,
    })
    type: LikeType;

    @ApiProperty({
        example: '2024-11-21 16:49:11.733',
        type: String,
    })
    createdAt: Date;
}
