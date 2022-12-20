import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private readonly http: HttpClient) {}

  getUsers(limit?: number, count?: number): Observable<IUser[]> {
    if (!limit || !count) {
      return this.http.get<IUser[]>(`${environment.apiUrl}/users`);
    }
    const params = new HttpParams().set('limit', limit).set('count', count);
    return this.http.get<IUser[]>(`${environment.apiUrl}/users`, { params });
  }

  newUser(payload: IUser): Observable<IUser> {
    return this.http.post<IUser>(`${environment.apiUrl}/users`, payload);
  }

  updateUser(id: string, payload: IUser): Observable<IUser> {
    return this.http.patch<IUser>(`${environment.apiUrl}/users/${id}`, payload);
  }

  getUser(id: string): Observable<IUser> {
    return this.http.get<IUser>(`${environment.apiUrl}/users/${id}`);
  }
  deleteUser(_id: string): Observable<{ result: string }> {
    return this.http.delete<{ result: string }>(
      `${environment.apiUrl}/users/${_id}`,
    );
  }
}
