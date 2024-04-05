import { Sort } from './sort';


export interface PageableObject {
    offset?: number;
    sort?: Sort;
    paged?: boolean;
    unpaged?: boolean;
    pageNumber?: number;
    pageSize?: number;
}

