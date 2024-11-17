import { IsEnum, IsOptional } from 'class-validator';

export enum SortOrder {
    ASC = 'asc',
    DESC = 'desc',
}

export enum SortBy {
    RATING = 'rating',
    DATE = 'createdAt',
}

export class SortingOptionsDto {
    @IsOptional()
    @IsEnum(SortOrder)
    order: SortOrder = SortOrder.DESC;

    @IsOptional()
    @IsEnum(SortBy)
    sort: SortBy = SortBy.RATING;
}
