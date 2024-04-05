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

