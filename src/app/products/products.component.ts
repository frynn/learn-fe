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
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  destroyed = new Subject<void>();
  currentScreenSize!: string;
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);
  constructor(
    breakpointObserver: BreakpointObserver,
    private readonly productsService: ProductsService,
    private readonly imagesService: ImagesService,
    private dialog: MatDialog,
  ) {
    breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe(takeUntil(this.destroyed))
      .subscribe((result) => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.currentScreenSize =
              this.displayNameMap.get(query) ?? 'Unknown';
          }
          switch (this.currentScreenSize) {
            case 'XSmall': {
              this.displayedColumns = [
                'name',
                'manufacturer',
                'editing',
                'delete',
              ];
              break;
            }
            case 'Small': {
              this.displayedColumns = [
                'name',
                'manufacturer',
                'image',
                'editing',
                'delete',
              ];
              break;
            }
            case 'Medium': {
              this.displayedColumns = [
                'name',
                'manufacturer',
                'image',
                'country_of_origin',
                'editing',
                'delete',
              ];
              break;
            }
            case 'Large': {
              this.displayedColumns = [
                'name',
                'manufacturer',
                'weight',
                'height',
                'depth',
                'image',
                'country_of_origin',
                'editing',
                'delete',
              ];
              break;
            }
            case 'XLarge': {
              this.displayedColumns = [
                'name',
                'manufacturer',
                'weight',
                'height',
                'depth',
                'image',
                'country_of_origin',
                'editing',
                'delete',
              ];
              break;
            }
          }
        }
      });
  }
  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
  length!: number;
  currentPageIndex: number = 0;
  currentPageSize: number = 5;
  displayedColumns: string[] = [
    'name',
    'manufacturer',
    'weight',
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
  }
}
