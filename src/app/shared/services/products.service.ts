import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IProduct } from '../interfaces/product.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export interface IProductPayload {
  name: string;
  manufacturer: string;
  width?: number;
  height?: number;
  depth?: number;
  country_of_origin?: string;
}

const ACCESS_TOKEN_KEY = 'access_token';

interface IProductDTO {
  access_token: string;
}
@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  access_token: string;
  constructor(private readonly http: HttpClient) {
    this.access_token = localStorage.getItem(ACCESS_TOKEN_KEY) || '';
  }

  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`${environment.apiUrl}/products`);
  }
  login(payload: IProductPayload): Observable<IProductDTO> {
    return this.http
      .post<IProductDTO>(`${environment.apiUrl}/products`, payload)
      .pipe(
        tap((response) => {
          this.access_token = response.access_token;
          localStorage.setItem(ACCESS_TOKEN_KEY, this.access_token);
        }),
      );
  }
}
