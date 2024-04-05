import { PageableObject } from './pageableObject';
import { Agency } from './agency';
import { Sort } from './sort';


export interface PageAgency {
    totalPages?: number;
    totalElements?: number;
    size?: number;
    content?: Array<Agency>;
    number?: number;
    sort?: Sort;
    pageable?: PageableObject;
    first?: boolean;
    last?: boolean;
    numberOfElements?: number;
    empty?: boolean;
}

