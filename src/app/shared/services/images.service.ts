import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  constructor(private readonly http: HttpClient) {}

  newImage(
    formData: FormData,
  ): Observable<{ originalname: string; filename: string }> {
    return this.http.post<{ originalname: string; filename: string }>(
      `${environment.apiUrl}/images`,
      formData,
    );
  }
}
