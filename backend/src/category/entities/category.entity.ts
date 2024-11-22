import { ApiProperty } from '@nestjs/swagger';

export class CategoryEntity {
    @ApiProperty({
        example: 1,
        type: Number,
    })
    id: number;

    @ApiProperty({
        example: 'javascript',
        type: String,
    })
    title: string;

    @ApiProperty({
        example: 'category includes all topics with javascript',
        type: String,
    })
    description?: string;

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
