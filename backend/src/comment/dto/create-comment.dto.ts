import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
    @ApiProperty({
        example: 'You should use margin',
        type: String,
    })
    @IsNotEmpty()
    @IsString()
    content: string;
}
