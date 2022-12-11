import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private readonly http: HttpClient) { }

  getUsers(): Observable<IUser[]> { 
    return this.http.get<IUser[]>(`${environment.apiUrl}/users`);
  }

  newUser(payload: IUser): Observable<IUser> {
    return this.http.post<IUser>(`${environment.apiUrl}/users`, payload);
  }
}
