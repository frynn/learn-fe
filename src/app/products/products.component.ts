import { Component, OnInit } from '@angular/core';
import { IProduct } from '../shared/interfaces/product.interface';
import { ProductsService } from '../shared/services/products.service';
import { ConfirmationDialogComponent } from '../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  constructor(
    private readonly productsService: ProductsService,
    private dialog: MatDialog,
  ) {}
  length!: number;
  currentPageIndex: number = 0;
  currentPageSize: number = 5;
  displayedColumns: string[] = [
    'id',
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
    this.productsService.getProducts(start, limit).subscribe({
      next: (response) => {
        this.dataSource.data = response.data;
        this.length = response.total;
      },
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
