import { ApiProperty } from '@nestjs/swagger';

export class FavoriteEntity {
    @ApiProperty({
        example: 1,
        type: Number,
    })
    id: number;

    @ApiProperty({
        example: 2,
        type: Number,
    })
    userId: number;

    @ApiProperty({
        example: 3,
        type: Number,
    })
    postId: number;
}
