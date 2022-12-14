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

  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${environment.apiUrl}/products`);
  }
  createProduct(payload: IProduct): Observable<IProduct> {
    return this.http.post<IProduct>(`${environment.apiUrl}/products`, payload);
  }
  deleteProduct(_id: string): Observable<string> {
    return this.http.delete<string>(`${environment.apiUrl}/products/${_id}`);
  }

  editingProduct(payload: IProduct, _id: string): Observable<IProduct> {
    return this.http.patch<IProduct>(
      `${environment.apiUrl}/products/${_id}`,
      payload,
    );
  }

  findProduct(_id: string) {
    return this.http.get<IProduct>(`${environment.apiUrl}/products/${_id}`);
  }
}
