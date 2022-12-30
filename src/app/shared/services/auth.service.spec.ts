import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { cold } from 'jasmine-marbles';
import { mockLoginPayload, mockUser, randomString } from '@unit-tests';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  const mockHttpClient = {
    get: jasmine.createSpy(),
    post: jasmine.createSpy(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        AuthService,
        { provide: HttpClient, useValue: mockHttpClient },
      ],
    });
    service = TestBed.inject(AuthService);

    mockHttpClient.get.calls.reset();
    mockHttpClient.post.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('`getProfile` should call http.get', () => {
    const user = mockUser();
    mockHttpClient.get.and.returnValue(cold('(c|)', { c: user }));
    const expected$ = cold('(c|)', { c: user });
    expect(service.getProfile()).toBeObservable(expected$);
    expect(mockHttpClient.get).toHaveBeenCalledWith(
      `${environment.apiUrl}/profile`,
    );
  });

  it('`login` should call http.post and store token in service and to localStorage', () => {
    service.access_token = '';
    const token = randomString();
    const spy = spyOn(localStorage, 'setItem');
    mockHttpClient.post.and.returnValue(
      cold('(c|)', { c: { access_token: token } }),
    );
    const expected$ = cold('(c|)', { c: { access_token: token } });
    const payload = mockLoginPayload();
    expect(service.login(payload)).toBeObservable(expected$);
    expect(mockHttpClient.post).toHaveBeenCalledWith(
      `${environment.apiUrl}/auth/login`,
      payload,
    );
    expect(service.access_token).toEqual(token);
    expect(spy).toHaveBeenCalledWith('access_token', token);
  });

  it('`isAuth` should return true if assess_token exists', () => {
    service.access_token = '';
    expect(service.isAuth()).toBeFalsy();
    service.access_token = randomString();
    expect(service.isAuth()).toBeTruthy();
  });

  it('`logout` should clear access_token', () => {
    service.profile = mockUser();
    service.access_token = randomString();
    const spy = spyOn(localStorage, 'removeItem');
    service.logout();
    expect(service.access_token).toEqual('');
    expect(service.profile).toBeNull();
    expect(spy).toHaveBeenCalled();
  });
});
