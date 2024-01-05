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
  templateUrl: './generator.component.html',
})
export class GeneratorComponent implements OnInit, OnDestroy {
  // form
  generatorForm: FormGroup;
  vendorid: FormControl;
  productid: FormControl;
  qty: FormControl;
  // data
  formSubscription?: Subscription;
  products$?: Observable<Product[]>; // everybody's products
  vendors$?: Observable<Vendor[]>; // all vendors
  vendorproducts$?: Observable<Product[]>; // all products for a particular vendor
  items: Array<PurchaseOrderItem>; // product items that will be in purchaseorder
  selectedproducts: Product[]; // products that being displayed currently in app
  selectedProduct: Product; // the current selected product
  selectedVendor: Vendor; // the current selected vendor
  selectedQty: number = 0; // the current selected qty
  qtys?: string[];
  // misc
  pickedProduct: boolean;
  pickedVendor: boolean;
  generated: boolean;
  hasProducts: boolean;
  pickedQty: boolean;
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
    this.pickedProduct = false;
    this.generated = false;
    this.pickedQty = false;
    this.msg = '';
    this.vendorid = new FormControl('');
    this.productid = new FormControl('');
    this.qty = new FormControl('');
    this.generatorForm = this.builder.group({
      productid: this.productid,
      vendorid: this.vendorid,
      qty: this.qty,
    });
    this.selectedProduct = {
      id: '',
      vendorid: 0,
      name: '',
      costprice: 0,
      msrp: 0.0,
      rop: 0,
      eoq: 0,
      qoh: 0,
      qoo: 0,
      qrcodetxt: '',
      qrcode: '',
    };
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
    this.items = new Array<PurchaseOrderItem>();
    this.selectedproducts = new Array<Product>();
    this.hasProducts = false;
    this.total = 0.0;
    this.sub = 0;
    this.tax = 0;
  } // constructor
  ngOnInit(): void {
    this.onPickVendor();
    this.onPickProduct();
    this.onPickQuantity();
    this.msg = 'loading vendors and products from server...';
    (this.vendors$ = this.vendorService.get()),
      catchError((err) => (this.msg = err.message));
    (this.products$ = this.productService.get()),
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
    this.formSubscription = this.generatorForm
      .get('vendorid')
      ?.valueChanges.subscribe((val) => {
        this.selectedProduct = {
          id: '',
          vendorid: 0,
          name: '',
          costprice: 0,
          msrp: 0.0,
          rop: 0,
          eoq: 0,
          qoh: 0,
          qoo: 0,
          qrcodetxt: '',
          qrcode: '',
        };
        this.selectedVendor = val;
        this.loadVendorProducts();
        this.pickedProduct = false;
        this.hasProducts = false;
        this.pickedQty = false;
        this.msg = 'choose product for vendor';
        this.pickedVendor = true;
        this.generated = false;
        this.items = []; // array for the purchaseorder
        this.selectedproducts = []; // array for the details in app html
      });
  } // onPickVendor
  /**
   * onPickProduct - subscribe to the select change event then
   * update array containing items.
   */
  onPickProduct(): void {
    const productSubscription = this.generatorForm
      .get('productid')
      ?.valueChanges.subscribe((val) => {
        this.selectedProduct = val;
        const item: PurchaseOrderItem = {
          id: 0,
          purchaseorderid: 0,
          productid: this.selectedProduct?.id.toString(),
          productName: this.selectedProduct?.name,
          qty: this.selectedProduct?.eoq,
          price: this.selectedProduct?.costprice,
        };
        if (
          this.items.find((item) => item.productid === this.selectedProduct?.id)
        ) {
          this.items.forEach((element, index) => {
            if (element.productid === this.selectedProduct?.id) {
              this.selectedQty = this.items[index].qty;
              if (this.selectedQty === this.selectedProduct.eoq)
                this.qty.setValue('EOQ');
              else this.qty.setValue(this.selectedQty);
            }
          });
        } else {
          this.pickedProduct = true;
          this.items.push(item);
          this.selectedproducts.push(this.selectedProduct);
          this.qtys = [];
          this.qtys.push('EOQ');
          this.qty.setValue('EOQ');
          this.selectedQty = this.selectedProduct.eoq;
          for (let i = 0; i < this.selectedProduct.eoq; i++) {
            this.qtys.push(i.toString());
          }
          this.msg =
            this.selectedQty + ' ' + this.selectedProduct.name + '(s) added';
        }
        if (this.items.length > 0) {
          this.hasProducts = true;
        }
        this.total = 0.0;
        this.sub = 0.0;
        this.tax = 0.0;
        this.items.forEach((exp) => (this.sub += exp.price * exp.qty));
        //compute total cost
        this.tax = this.sub * 0.13;
        this.total = this.sub + this.tax;
      });
    //this.formSubscription?.add(productSubscription); // add it as a child, so all can be destroyed together
  } // onPickProduct

  onPickQuantity(): void {
    const qtySubscription = this.generatorForm
      .get('qty')
      ?.valueChanges.subscribe((val) => {
        this.pickedQty = true;
        this.selectedQty = val;
        if (val === 'EOQ') this.selectedQty = this.selectedProduct.eoq;
        if (
          this.items.find((item) => item.productid === this.selectedProduct?.id)
        ) {
          if (val === '0') {
            this.items = this.items.filter(
              (item) => item.productid !== this.selectedProduct?.id
            );
            this.msg =
              'All ' + this.selectedProduct.name + 's has been removed';
            if (this.items.length === 0) {
              this.hasProducts = false;
            }
          } else
            this.items.forEach((element, index) => {
              if (element.productid === this.selectedProduct?.id) {
                this.items[index].qty = this.selectedQty;
                this.msg =
                  'The total quantity of ' +
                  this.selectedProduct.name +
                  ' is: ' +
                  this.selectedQty;
              }
            });
        } else {
          const item: PurchaseOrderItem = {
            id: 0,
            purchaseorderid: 0,
            productid: this.selectedProduct?.id.toString(),
            productName: this.selectedProduct?.name,
            qty: val,
            price: this.selectedProduct?.costprice,
          };
          this.items.push(item);
          this.hasProducts = true;
        }
        this.total = 0.0;
        this.tax = 0.0;
        this.sub = 0.0;
        this.items.forEach((item) => (this.sub += item.price * item.qty));
        this.tax = this.sub * 0.13;
        this.total = this.sub + this.tax;
      });

    this.formSubscription?.add(qtySubscription); // add it as a child, so all can be destroyed together
  }

  /**
   * loadVendorProducts - filter for a particular vendor's products
   */
  loadVendorProducts(): void {
    this.vendorproducts$ = this.products$?.pipe(
      map((products) =>
        // map each product in the array and check whether or not it belongs to selected vendor
        products.filter(
          (product) => product.vendorid === this.selectedVendor?.id
        )
      )
    );
  } // loadVendorProducts
  /**
   * createPurchaseOrder - create the client side purchaseorder
   */
  createPurchaseOrder(): void {
    this.generated = false;
    const purchaseorder: PurchaseOrder = {
      id: 0,
      items: this.items,
      vendorid: this.selectedProduct.vendorid,
      amount: this.total,
    };
    this.purchaseorderService.add(purchaseorder).subscribe({
      // observer object
      next: (purchaseorder: PurchaseOrder) => {
        // server should be returning purchaseorder with new id
        purchaseorder.id > 0
          ? (this.msg = `Purchase Order ${purchaseorder.id} added!`)
          : (this.msg = 'Purchase Order not added! - server error');
        this.purchaseorderno = purchaseorder.id;
      },
      error: (err: Error) =>
        (this.msg = `Purchase Order not added! - ${err.message}`),
      complete: () => {
        this.hasProducts = false;
        this.pickedVendor = false;
        this.pickedProduct = false;
        this.generated = true;
        this.pickedQty = false;
      },
    });
  } // createPurchaseOrder

  viewPdf(): void {
    window.open(`${PDFURL}${this.purchaseorderno}`, '');
  } // viewPdf
} // GeneratorComponent
