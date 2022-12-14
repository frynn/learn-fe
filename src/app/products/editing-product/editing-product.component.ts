import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { ProductsService } from '../../shared/services/products.service';

@Component({
  selector: 'app-editing-product',
  templateUrl: './editing-product.component.html',
  styleUrls: ['./editing-product.component.scss'],
})
export class EditingProductComponent {
  id?: string;
  formGroup!: FormGroup;
  product?: IProduct;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly productsService: ProductsService,
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id'];
      this.productsService.findProduct(this.id!).subscribe({
        next: (product) => {
          this.product = product;
          this.formGroup = this.fb.group({
            name: this.fb.control<string>(
              this.product.name,
              Validators.required,
            ),
            manufacturer: this.fb.control<string>(
              this.product.manufacturer,
              Validators.required,
            ),
            width: this.fb.control<number | null>(
              Number(this.product.width),
              Validators.pattern(/^[0-9,.]+$/),
            ),
            height: this.fb.control<number | null>(
              Number(this.product.height),
              Validators.pattern(/^[0-9,.]+$/),
            ),
            depth: this.fb.control<number | null>(
              Number(this.product.depth),
              Validators.pattern(/^[0-9,.]+$/),
            ),
            country_of_origin: this.fb.control<string>(
              String(this.product.country_of_origin),
            ),
          });
        },
        error: (err) => console.error(err),
      });
    });
  }

  editingProduct() {
    this.productsService
      .editingProduct(this.formGroup!.value, this.id!)
      .subscribe({
        next: () => this.router.navigateByUrl('products'),
        error: (err) => console.error(err),
      });
  }
}
