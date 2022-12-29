import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '@interfaces';
import { IPaginatedResponse } from '../interfaces/paginated-response';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private readonly http: HttpClient) {}

  getUsers(
    start?: number,
    limit?: number,
  ): Observable<IPaginatedResponse<IUser[]>> {
    if (start === undefined || limit === undefined) {
      return this.http.get<IPaginatedResponse<IUser[]>>(
        `${environment.apiUrl}/users`,
      );
    }
    const params = new HttpParams()
      .set('start', start * limit)
      .set('limit', limit);
    return this.http.get<IPaginatedResponse<IUser[]>>(
      `${environment.apiUrl}/users`,
      { params },
    );
  }

  newUser(payload: IUser): Observable<IUser> {
    return this.http.post<IUser>(`${environment.apiUrl}/users`, payload);
  }

  updateUser(id: string, payload: Partial<IUser>): Observable<IUser> {
    return this.http.patch<IUser>(`${environment.apiUrl}/users/${id}`, payload);
  }

  getUser(id: string): Observable<IUser> {
    return this.http.get<IUser>(`${environment.apiUrl}/users/${id}`);
  }

  deleteUser(id: string): Observable<{ result: string }> {
    return this.http.delete<{ result: string }>(
      `${environment.apiUrl}/users/${id}`,
    );
  }
}
