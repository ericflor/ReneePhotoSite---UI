/**
 * Inventory System API
 * Phone Inventory System for Monopoly Solutions LLC
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
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
