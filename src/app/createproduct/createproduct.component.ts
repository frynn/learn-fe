import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '../shared/services/products.service';
@Component({
  selector: 'app-createproduct',
  templateUrl: './createproduct.component.html',
  styleUrls: ['./createproduct.component.scss'],
})
export class CreateproductComponent implements OnInit {
  formGroup: FormGroup;
  constructor(
    private router: Router,
    private readonly fb: FormBuilder,
    private readonly productsService: ProductsService,
  ) {
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      manufacturer: ['', Validators.required],
      width: [''],
      height: [''],
      depth: [''],
      country_of_origin: [''],
    });
  }

  login() {
    this.productsService.login(this.formGroup.value).subscribe({
      next: () => this.router.navigateByUrl('products'),
      error: (err) => console.error(err),
    });
  }
  ngOnInit(): void {}
}
