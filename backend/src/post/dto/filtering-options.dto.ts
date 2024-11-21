import { Status } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
    IsBoolean,
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

export class FilteringOptionsDto {
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    startDate?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    endDate?: Date;

    @IsOptional()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    @Transform(({ value }) => [...value.split(',')])
    categories?: string[];

    @IsOptional()
    @IsEnum(Status)
    status?: Status;

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    favorite?: boolean = false;
}
