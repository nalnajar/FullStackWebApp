import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PurchaseOrder } from '@app/report/purchaseorder';
import { GenericHttpService } from '@app/generic-http.service';
@Injectable({
 providedIn: 'root',
})
export class PurchaseOrderService extends GenericHttpService<PurchaseOrder> {
 constructor(httpClient: HttpClient) {
 super(httpClient, `pos`);
 } // constructor
} // EmployeeService