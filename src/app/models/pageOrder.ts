import { Order } from './order';
import { PageableObject } from './pageableObject';
import { Sort } from './sort';


export interface PageOrder {
    totalPages?: number;
    totalElements?: number;
    size?: number;
    content?: Array<Order>;
    number?: number;
    sort?: Sort;
    pageable?: PageableObject;
    first?: boolean;
    last?: boolean;
    numberOfElements?: number;
    empty?: boolean;
}

