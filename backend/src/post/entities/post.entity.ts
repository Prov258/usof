import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';

export class PostEntity {
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
        example: 'How to center div?',
        type: String,
    })
    title: string;

    @ApiProperty({
        example: 'ACTIVE',
        type: String,
        enum: Status,
    })
    status?: Status;

    @ApiProperty({
        example: 'Please give me some advices',
        type: String,
    })
    content: string;

    @ApiProperty({
        example: 6,
        type: Number,
    })
    rating: number;
}
