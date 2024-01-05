import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Product } from '@app/product/product';
import { Vendor } from '@app/vendor/vendor';
import { VendorService } from '@app/vendor/vendor.service';
import { ProductService } from '@app/product/product.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  templateUrl: 'product-home.component.html',
})
export class ProductHomeComponent implements OnInit, AfterViewInit {
  // Observables
  vendors$?: Observable<Vendor[]>; // for vendor drop down
  products$?: Observable<Product[]>;
  productDataSource$?: Observable<MatTableDataSource<Product>>; // for MatTable
  // misc.
  product: Product;
  hideEditForm: boolean;
  msg: string;
  isNew: boolean = false;
  size: number = 0;
  // sort stuff
  displayedColumns: string[] = ['id', 'name', 'vendorid'];
  dataSource: MatTableDataSource<Product> = new MatTableDataSource<Product>();
  @ViewChild(MatSort) sort: MatSort;
  // MatPaginator
  length = 0;
  pageSize = 5;
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor(
    private vendorService: VendorService,
    private productService: ProductService
  ) {
    this.hideEditForm = true;
    this.product = {
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
    this.msg = '';
    this.sort = new MatSort();
  }

  ngOnInit(): void {
    (this.productDataSource$ = this.productService.get().pipe(
      map((products) => {
        const dataSource = new MatTableDataSource<Product>(products);
        this.dataSource.data = products;
        this.dataSource.sort = this.sort;

        // Calculate and set the pageSize based on the number of items in the data source
        if (this.paginator !== undefined) {
          this.paginator.pageSize = this.pageSize; // You can adjust the divisor as needed
          this.dataSource.paginator = this.paginator;
        }

        return dataSource;
      })
    )),
      catchError((err) => (this.msg = err.message));
  }

  ngAfterViewInit(): void {
    // loading vendors later here because timing issue with cypress testing in OnInit
    this.vendors$ = this.vendorService.get();
    this.products$ = this.productService.get();
    catchError((err) => (this.msg = err.message));
  }

  select(selectedProduct: Product): void {
    this.product = selectedProduct;
    this.msg = `Product ${selectedProduct.id} selected`;
    this.hideEditForm = !this.hideEditForm;
  }

  cancel(msg?: string): void {
    this.hideEditForm = !this.hideEditForm;
    this.msg = 'operation cancelled';
  }

  update(selectedProduct: Product): void {
    this.productService.update(selectedProduct).subscribe({
      next: (exp: Product) => (this.msg = `Product ${exp.id} updated!`),
      error: (err: Error) => (this.msg = `Update failed! - ${err.message}`),
      complete: () => {
        this.hideEditForm = !this.hideEditForm;
      },
    });
  }

  save(product: Product): void {
    !this.isNew ? this.update(product) : this.add(product);
  }

  add(newProduct: Product): void {
    this.msg = 'Adding product...';
    this.productService.add(newProduct).subscribe({
      next: (exp: Product) => {
        this.msg = `Product ${exp.id} added!`;
      },
      error: (err: Error) => (this.msg = `Product not added! - ${err.message}`),
      complete: () => {
        this.hideEditForm = !this.hideEditForm;
        this.isNew = false;
      },
    });
  }

  delete(selectedProduct: Product): void {
    this.productService.deleteByString(selectedProduct.id).subscribe({
      next: (numOfProductsDeleted: number) => {
        numOfProductsDeleted === 1
          ? (this.msg = `Product ${selectedProduct.id} deleted!`)
          : (this.msg = `Product ${selectedProduct.id} not deleted!`);
      },
      error: (err: Error) => (this.msg = `Delete failed! - ${err.message}`),
      complete: () => {
        this.hideEditForm = !this.hideEditForm;
      },
    });
  }

  newProduct(): void {
    this.product = {
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
    this.msg = 'New product';
    this.isNew = true;
    this.hideEditForm = !this.hideEditForm;
  }

  sortProductsWithObjectLiterals(sort: Sort): void {
    const literals = {
      id: () =>
        (this.dataSource.data = this.dataSource.data.sort(
          (a: Product, b: Product) =>
            sort.direction === 'asc'
              ? a.id < b.id
                ? -1
                : 1
              : b.id < a.id
              ? -1
              : 1
        )),
      vendorid: () =>
        (this.dataSource.data = this.dataSource.data.sort(
          (a: Product, b: Product) =>
            sort.direction === 'asc'
              ? a.vendorid - b.vendorid
              : b.vendorid - a.vendorid
        )),
      name: () =>
        (this.dataSource.data = this.dataSource.data.sort(
          (a: Product, b: Product) =>
            sort.direction === 'asc'
              ? a.name < b.name
                ? -1
                : 1
              : b.name < a.name
              ? -1
              : 1
        )),
    };
    literals[sort.active as keyof typeof literals]();
  }
}
