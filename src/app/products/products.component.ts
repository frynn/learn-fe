import { Component, OnInit } from '@angular/core';
import { IProduct } from '../shared/interfaces/product.interface';
import { ProductsService } from '../shared/services/products.service';
import { ImagesService } from '../shared/services/images.service';
import { ConfirmationDialogComponent } from '../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { map, mergeAll, mergeMap, of, toArray, Subject } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  displayNameMap = [
    Breakpoints.Small,
    Breakpoints.Medium,
    Breakpoints.Large,
    Breakpoints.XLarge,
  ];

  constructor(
    private readonly breakpointObserver: BreakpointObserver,
    private readonly productsService: ProductsService,
    private readonly imagesService: ImagesService,
    private dialog: MatDialog,
  ) {
    this.breakpointObserver.observe(this.displayNameMap).subscribe((result) => {
      this.displayedColumns = ['name', 'manufacturer'];
      for (const bp of this.displayNameMap) {
        if (!result.breakpoints[bp]) continue;

        switch (bp) {
          case Breakpoints.Small: {
            this.displayedColumns.push('image');
            break;
          }

          case Breakpoints.Medium: {
            this.displayedColumns.push('image', 'country_of_origin');
            break;
          }

          case Breakpoints.Large:
          case Breakpoints.XLarge:
          default: {
            this.displayedColumns.push(
              'width',
              'height',
              'depth',
              'image',
              'country_of_origin',
            );
            break;
          }
        }
      }

      this.displayedColumns.push('editing', 'delete');
    });
  }
  length!: number;
  currentPageIndex: number = 0;
  currentPageSize: number = 5;
  pageSize: number = 5;
  pageIndex!: number;
  displayedColumns: string[] = [
    'name',
    'manufacturer',
    'width',
    'height',
    'depth',
    'image',
    'country_of_origin',
    'editing',
    'delete',
  ];
  dataSource = new MatTableDataSource([] as IProduct[]);

  openDialog(product: IProduct): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Delete a product?',
        buttonName: 'Delete',
      },
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.deleteProduct(product._id);
        }
      },
      error: (err) => console.error(err),
    });
  }

  deleteProduct(id: string) {
    this.productsService.deleteProduct(id).subscribe({
      next: () => this.getProducts(this.currentPageIndex, this.currentPageSize),
      error: (err) => console.error(err),
    });
  }

  getProducts(start?: number, limit?: number) {
    this.productsService
      .getProducts(start, limit)
      .pipe(
        map((response) => {
          this.length = response.total;
          return response.data;
        }),
        mergeAll(),
        mergeMap((product) => {
          if (product.image) {
            return this.imagesService
              .getImage(product.image)
              .pipe(map((imagePreview) => ({ ...product, imagePreview })));
          }
          return of(product);
        }),
        toArray(),
      )
      .subscribe({
        next: (products) => (this.dataSource.data = products),
        error: (err) => console.error(err),
      });
  }

  ngOnInit(): void {
    this.getProducts(this.currentPageIndex, this.currentPageSize);
  }

  onPage(event: PageEvent) {
    this.getProducts(event.pageIndex, event.pageSize);
    this.currentPageIndex = event.pageIndex;
    this.currentPageSize = event.pageSize;
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }
}
