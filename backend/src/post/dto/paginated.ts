import { PaginatedMetadata } from './paginated-metadata';

export class Paginated<T> {
    data: T[];
    meta: PaginatedMetadata;
}
