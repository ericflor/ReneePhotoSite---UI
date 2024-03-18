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
import { Agency } from './agency';


export interface Phone {
    imei?: string;
    status?: string;
    type?: string;
    model?: string;
    masterAgent?: string;
    distributor?: string;
    retailer?: string;
    date?: string;
    employee?: Agency;
}

