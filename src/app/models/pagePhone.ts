import { PageableObject } from './pageableObject';
import { Phone } from './phone';
import { Sort } from './sort';


export interface PagePhone {
    totalPages?: number;
    totalElements?: number;
    size?: number;
    content?: Array<Phone>;
    number?: number;
    sort?: Sort;
    pageable?: PageableObject;
    first?: boolean;
    last?: boolean;
    numberOfElements?: number;
    empty?: boolean;
}

