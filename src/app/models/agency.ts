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


export interface Agency { 
    id?: number;
    name?: string;
    email?: string;
    username?: string;
    password?: string;
    blocked?: boolean;
    level?: Agency.LevelEnum;
    role?: Agency.RoleEnum;
}
export namespace Agency {
    export type LevelEnum = 'MASTER_AGENT' | 'DISTRIBUTOR' | 'RETAILER' | 'EMPLOYEE';
    export const LevelEnum = {
        MasterAgent: 'MASTER_AGENT' as LevelEnum,
        Distributor: 'DISTRIBUTOR' as LevelEnum,
        Retailer: 'RETAILER' as LevelEnum,
        Employee: 'EMPLOYEE' as LevelEnum
    };
    export type RoleEnum = 'ADMIN' | 'EMPLOYEE';
    export const RoleEnum = {
        Admin: 'ADMIN' as RoleEnum,
        Employee: 'EMPLOYEE' as RoleEnum
    };
}


