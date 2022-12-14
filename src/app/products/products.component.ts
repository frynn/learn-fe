import { Component, OnInit } from '@angular/core';
import { IProduct } from '../shared/interfaces/product.interface';
import { ProductsService } from '../shared/services/products.service';
import { ConfirmationDialogComponent } from '../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products: IProduct[] = [];
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
  constructor(
    private readonly productsService: ProductsService,
    private dialog: MatDialog,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.getProducts();
  }

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
      next: () => this.getProducts(),
      error: (err) => console.error(err),
    });
  }

  getProducts() {
    this.productsService.getProducts().subscribe({
      next: (products) => (this.products = products),
      error: (err) => console.error(err),
    });
  }
}
