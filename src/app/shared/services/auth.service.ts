import { Injectable } from '@angular/core';
import { IUser } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';

export interface ILoginPayload {
  username: string;
  password: string;
}

interface ILoginDTO {
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  profile: IUser | null = null;
  access_token = '';

  constructor(private readonly http: HttpClient) {}

  login(payload: ILoginPayload): Observable<ILoginDTO> {
    return this.http
      .post<ILoginDTO>(`${environment.apiUrl}/auth/login`, payload)
      .pipe(
        tap((response) => {
          this.access_token = response.access_token;
        }),
      );
  }

  logout() {
    this.access_token = '';
    this.profile = null;
  }

  getProfile(): Observable<IUser | null> {
    return this.http.get<IUser>(`${environment.apiUrl}/profile`);
  }
}
