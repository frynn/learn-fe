import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IProduct } from '../interfaces/product.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private readonly http: HttpClient) {}

  getProducts(): Observable<IProduct[] | null> {
    return this.http.get<IProduct[]>(`${environment.apiUrl}/products`);
  }
}