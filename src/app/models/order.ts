export interface Order {
    id?: number;
    companyName?: string;
    nameOfRecipient?: string;
    phoneNumber?: string;
    email?: string;
    date?: string;
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


