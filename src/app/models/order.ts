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


export interface Order { 
    id?: number;
    companyName?: string;
    nameOfRecipient?: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    nameETC?: string;
    quantity?: number;
    notes?: string;
    trackingNumber?: string;
    status?: Order.StatusEnum;
}
export namespace Order {
    export type StatusEnum = 'NEW' | 'APPROVED' | 'SHIPPED' | 'DENIED';
    export const StatusEnum = {
        New: 'NEW' as StatusEnum,
        Approved: 'APPROVED' as StatusEnum,
        Shipped: 'SHIPPED' as StatusEnum,
        Denied: 'DENIED' as StatusEnum
    };
}

