import { TestBed } from '@angular/core/testing';

import { UsersService } from './users.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { mockArray, mockUser, randomEmail, randomNumber } from '@unit-tests';
import { environment } from '../../../environments/environment';
import { IPaginatedResponse } from '../interfaces/paginated-response';
import { IUser } from '@interfaces';

describe('UsersService', () => {
  let service: UsersService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(UsersService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('should get users', () => {
    it('by id', function () {
      const id = randomNumber();
      const user = mockUser();

      service
        .getUser(id.toString())
        .subscribe((response) => expect(response).toEqual(user));

      const req = httpController.expectOne(`${environment.apiUrl}/users/${id}`);
      req.flush(user);

      const method = req.request.method;
      expect(method).toBe('GET');
    });

    it('without pagination', function () {
      const userAmount = 45;
      const users = mockArray(userAmount, () => mockUser());
      const reqBody: IPaginatedResponse<IUser[]> = {
        total: userAmount,
        data: users,
      };

      service.getUsers().subscribe({
        next: (response) => {
          expect(response.total).toEqual(userAmount);
          expect(response.start).not.toBeDefined();
          expect(response.limit).not.toBeDefined();
          expect(response.data).toEqual(users);
        },
      });

      const req = httpController.expectOne(`${environment.apiUrl}/users`);
      req.flush(reqBody);

      const params = req.request.params;
      expect(params.keys()).toEqual([]);

      const method = req.request.method;
      expect(method).toBe('GET');
    });

    it('with pagination', function () {
      const userAmount = 45;
      const users = mockArray(userAmount, () => mockUser());

      // pagination
      const page = 2;
      const limit = 10;
      const start = page * limit;

      // mock response
      const slicedUsers = users.slice(start, start + limit);
      const reqBody: IPaginatedResponse<IUser[]> = {
        total: userAmount,
        start: start,
        limit: limit,
        data: slicedUsers,
      };

      service.getUsers(page, limit).subscribe({
        next: (response) => {
          expect(response.total).toBe(userAmount);
          expect(response.start).toBe(start);
          expect(response.limit).toBe(limit);
          expect(response.data).toEqual(slicedUsers);
        },
      });

      const req = httpController.expectOne(
        `${environment.apiUrl}/users?start=${start}&limit=${limit}`,
      );
      req.flush(reqBody);

      const params = req.request.params;
      expect(params.get('start')).toBe(start.toString());
      expect(params.get('limit')).toBe(limit.toString());

      const method = req.request.method;
      expect(method).toBe('GET');
    });
  });

  it('should post new user', function () {
    const user = mockUser();
    const id = randomNumber().toString();

    service
      .newUser(user)
      .subscribe((response) =>
        expect(response).toEqual({ ...user, userId: id }),
      );

    const req = httpController.expectOne(`${environment.apiUrl}/users`);
    req.flush({ ...user, userId: id });

    const body = req.request.body;
    expect(body).toEqual(user);

    const method = req.request.method;
    expect(method).toBe('POST');
  });

  it('should update user', function () {
    const user = mockUser();
    const newEmail = randomEmail();
    const update: Partial<IUser> = { email: newEmail };

    service.updateUser(user.userId, update).subscribe({
      next: (response) => {
        expect(response.email).toBe(newEmail);
        expect(response).toEqual({ ...user, email: newEmail });
      },
    });

    const req = httpController.expectOne(
      `${environment.apiUrl}/users/${user.userId}`,
    );
    req.flush({ ...user, email: newEmail });

    const body = req.request.body;
    expect(body).toEqual(update);

    const method = req.request.method;
    expect(method).toBe('PATCH');
  });

  it('should delete user', function () {
    const id = randomNumber().toString();

    service
      .deleteUser(id)
      .subscribe((response) => expect(response).toEqual({ result: 'ok' }));

    const req = httpController.expectOne(`${environment.apiUrl}/users/${id}`);
    req.flush({ result: 'ok' });

    const method = req.request.method;
    expect(method).toBe('DELETE');
  });
});
