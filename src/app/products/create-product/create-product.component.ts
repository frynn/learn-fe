import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '../../shared/services/products.service';
@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
})
export class CreateProductComponent {
  formGroup: FormGroup = this.fb.group({
    name: this.fb.control<string>('', Validators.required),
    manufacturer: this.fb.control<string>('', Validators.required),
    width: this.fb.control<number | null>(
      null,
      Validators.pattern(/^[0-9,.]+$/),
    ),
    height: this.fb.control<number | null>(
      null,
      Validators.pattern(/^[0-9,.]+$/),
    ),
    depth: this.fb.control<number | null>(
      null,
      Validators.pattern(/^[0-9,.]+$/),
    ),
    country_of_origin: this.fb.control<string>(''),
  });

  constructor(
    private router: Router,
    private readonly fb: FormBuilder,
    private readonly productsService: ProductsService,
  ) {}
  createProduct() {
    this.productsService.createProduct(this.formGroup.value).subscribe({
      next: () => this.router.navigateByUrl('products'),
      error: (err) => console.error(err),
    });
  }
}
