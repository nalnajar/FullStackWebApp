import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Vendor } from '@app/vendor/vendor';
import { Product } from '@app/product/product';
import { PurchaseOrderItem } from '@app/report/purchaseorder-item';
import { PurchaseOrder } from '@app/report/purchaseorder';
import { VendorService } from '@app/vendor/vendor.service';
import { ProductService } from '@app/product/product.service';
import { PurchaseOrderService } from '@app/report/purchaseorder.service';
import { PDFURL } from '@app/constants';

@Component({
  templateUrl: './viewer.component.html',
})
export class ViewerComponent implements OnInit, OnDestroy {
// form
viewerForm: FormGroup;
vendorid: FormControl;
purchaseorderid: FormControl;
// data
formSubscription?: Subscription;
vendorProducts?: Product[]; // products for selected vendor
purchaseorderProducts?: Product[]; // product items that will be in purchaseorder
purchaseorders$?: Observable<PurchaseOrder[]>; // all purchaseorders for selected vendor
vendors$?: Observable<Vendor[]>; // all vendors
vendorproducts$?: Observable<Product[]>; // all products for a particular vendor
selectedVendor: Vendor; // the current selected vendor
selectedPurchaseorder: PurchaseOrder; // the current selected purchaseorder
//items: Array<PurchaseOrderItem>;
// misc
pickedVendor: boolean;
showPdf: boolean;
hasProducts: boolean;
msg: string;
total: number;
tax: number;
sub: number;
purchaseorderno: number = 0;
constructor(
  private builder: FormBuilder,
  private vendorService: VendorService,
  private productService: ProductService,
  private purchaseorderService: PurchaseOrderService
) {
  this.pickedVendor = false;
  this.showPdf = false;
  this.msg = '';
  this.vendorid = new FormControl('');
  this.purchaseorderid = new FormControl('');
  this.viewerForm = this.builder.group({
    vendorid: this.vendorid,
    purchaseorderid: this.purchaseorderid,
  });
  this.selectedVendor = {
    id: 0,
    name: '',
    address1: '',
    postalcode: '',
    city: '',
    province: '',
    email: '',
    phone: '',
    type: '',
   };
  this.selectedPurchaseorder = {
    id: 0,
    vendorid: 0,
    amount: 0,
    items: new Array<PurchaseOrderItem>(),
  };
  //this.purchaseorderProducts = new Array<PurchaseOrderItem>();
  //this.items = new Array<PurchaseOrderItem>();
  this.hasProducts = false;
  this.total = 0.0;
  this.sub = 0;
  this.tax = 0;
} // constructor
ngOnInit(): void {
  this.onPickVendor();
  this.onPickPurchaseOrder();
  this.msg = 'loading vendors and products from server...';
  (this.vendors$ = this.vendorService.get()),
    catchError((err) => (this.msg = err.message));
  this.msg = 'server data loaded';
} // ngOnInit
ngOnDestroy(): void {
  if (this.formSubscription !== undefined) {
    this.formSubscription.unsubscribe();
  }
} // ngOnDestroy
/**
 * onPickVendor - Another way to use Observables, subscribe to the select change event
 * then load specific vendor products for subsequent selection
 */
onPickVendor(): void {
  this.formSubscription = this.viewerForm
    .get('vendorid')
    ?.valueChanges.subscribe((val) => {
      this.selectedVendor = val;
      this.loadVendorProducts(this.selectedVendor.id);
      this.purchaseorders$ = this.purchaseorderService.getSome(this.selectedVendor.id);
      this.hasProducts = false;
      this.msg = 'choose purchaseorder';
      this.pickedVendor = true;
      this.showPdf = false;
    });
} // onPickVendor
onPickPurchaseOrder(): void {
  const purchaseorderSubscription = this.viewerForm
    .get('purchaseorderid')
    ?.valueChanges.subscribe((val) => {
      this.selectedPurchaseorder = val;

      if (this.vendorProducts !== undefined) {
        this.purchaseorderProducts = this.vendorProducts.filter((product) =>
          this.selectedPurchaseorder?.items.some(
            (item) => item.productid === product.id
          )
        );
      }
      this.purchaseorderno = this.selectedPurchaseorder.id;
      if (this.purchaseorderProducts !== undefined) {
        this.hasProducts = true;
        this.showPdf = true;
      }
      this.selectedPurchaseorder?.items.forEach((exp) => (this.total += exp.price * exp.qty));
      this.sub = this.total;
      this.tax = this.total * 0.13;
      this.total = this.tax + this.sub;
    });
  this.formSubscription?.add(purchaseorderSubscription); // add it as a child, so all can be destroyed together
  
} // onPickPurchaseorder
/**
 * loadVendorProducts - filter for a particular vendor's products
 */
loadVendorProducts(id: number): void {
  // products aren't part of the page, so we don't use async pipe here
  this.msg = 'loading products...';
  this.productService
    .getSome(id)
    .subscribe((products) => (this.vendorProducts = products));
} //loadVendorProducts
viewPdf(): void {
  window.open(`${PDFURL}${this.purchaseorderno}`, '');
} // viewPdf

}
