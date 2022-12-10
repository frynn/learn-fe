import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '../shared/services/products.service';
@Component({
  selector: 'app-createproduct',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
})
export class CreateProductComponent {
  formGroup: FormGroup = this.fb.group({
    name: ['', Validators.required],
    manufacturer: ['', Validators.required],
    width: [''],
    height: [''],
    depth: [''],
    country_of_origin: [''],
  });

  constructor(
    private router: Router,
    private readonly fb: FormBuilder,
    private readonly productsService: ProductsService,
  ) {}
  createproduct() {
    this.productsService.createproduct(this.formGroup.value).subscribe({
      next: () => this.router.navigateByUrl('products'),
      error: (err) => console.error(err),
    });
  }
}
