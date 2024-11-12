import { PaginatedMetadata } from './paginatedMetadata';

export class Paginated<T> {
    data: T[];
    meta: PaginatedMetadata;
}
