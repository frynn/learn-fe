import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IProduct } from '../interfaces/product.interface';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPaginatedResponse } from '../interfaces/paginated-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private readonly http: HttpClient) {}

  getProducts(
    start?: number,
    limit?: number,
  ): Observable<IPaginatedResponse<IProduct[]>> {
    if (start === undefined || limit === undefined) {
      return this.http.get<IPaginatedResponse<IProduct[]>>(
        `${environment.apiUrl}/products`,
      );
    }
    const params = new HttpParams()
      .set('start', start * limit)
      .set('limit', limit);
    return this.http.get<IPaginatedResponse<IProduct[]>>(
      `${environment.apiUrl}/products`,
      { params },
    );
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
