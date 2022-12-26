import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IProduct } from 'src/app/shared/interfaces/product.interface';
import { ProductsService } from '../../shared/services/products.service';
import { ImagesService } from '../../shared/services/images.service';

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
    private readonly imagesService: ImagesService,
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id'];
      this.productsService.findProduct(this.id!).subscribe({
        next: (product) => {
          this.product = product;
          this.downloadImage(this.product.image);
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
            image: this.fb.control<string>(String(this.product.image || '')),
          });
        },
        error: (err) => console.error(err),
      });
    });
  }

  downloadImage(image?: string) {
    if (image) {
      this.imagesService.getImage(image).subscribe((imagePreview) => {
        if (this.product) {
          this.product.imagePreview = imagePreview;
        }
      });
    }
  }

  editingProduct() {
    this.productsService
      .editingProduct(this.formGroup!.value, this.id!)
      .subscribe({
        next: () => this.router.navigateByUrl('products'),
        error: (err) => console.error(err),
      });
  }

  onLoadImage(event: Event) {
    const formdata = new FormData();
    const target = <HTMLInputElement>event.target;
    if (target.files) {
      formdata.append('file', target.files[0]);
      this.imagesService.uploadImage(formdata).subscribe({
        next: (result) => {
          this.formGroup.patchValue({
            image: result.filename,
          });
          this.downloadImage(result.filename);
          this.formGroup.markAsDirty();
        },
        error: (err) => console.error(err),
      });
    }
  }
}
