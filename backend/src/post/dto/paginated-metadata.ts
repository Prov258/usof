import { ApiProperty } from '@nestjs/swagger';

export class PaginatedMetadata {
    @ApiProperty({
        example: 2,
        type: Number,
    })
    page: number;

    @ApiProperty({
        example: 15,
        type: Number,
    })
    limit: number;

    @ApiProperty({
        example: 30,
        type: Number,
    })
    itemCount: number;

    @ApiProperty({
        example: 2,
        type: Number,
    })
    pageCount: number;

    @ApiProperty({
        example: 1,
        type: Number,
    })
    prev: number;

    @ApiProperty({
        example: null,
        type: Number,
    })
    next: number;
}
