import { Component, OnInit } from '@angular/core';
import { IProduct } from '../shared/interfaces/product.interface';
import { ProductsService } from '../shared/services/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productstable',
  templateUrl: './productstable.component.html',
  styleUrls: ['./productstable.component.scss'],
})
export class ProductstableComponent implements OnInit {
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
  ];
  constructor(
    private readonly productsService: ProductsService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }
  getProducts() {
    this.productsService.getProducts().subscribe({
      next: (products) => (this.products = products),
      error: (err) => console.error(err),
    });
  }
  gocreate() {
    this.router.navigateByUrl('createproducts');
  }
}
