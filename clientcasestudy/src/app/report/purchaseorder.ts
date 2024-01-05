import { PurchaseOrderItem } from './purchaseorder-item';
/**
* Report - interface for expense report
*/
export interface PurchaseOrder {
    id: number;
    vendorid: number;
    items: PurchaseOrderItem[];
    amount: number;
    podate?: string;
   }