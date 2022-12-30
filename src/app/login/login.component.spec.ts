import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { randomBoolean } from '@unit-tests';
import { cold, getTestScheduler } from 'jasmine-marbles';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  const mockAuthService = {
    login: jasmine.createSpy().and.returnValue(of()),
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [RouterTestingModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.showPassword).toBeFalse();
    expect(component.formGroup.value).toEqual({ username: '', password: '' });
  });

  it('`togglePasswordVisibility` should toggle showPassword', () => {
    const testValue = randomBoolean();
    component.showPassword = testValue;
    component.togglePasswordVisibility();
    expect(component.showPassword).toBe(!testValue);
  });

  describe('`login`', () => {
    it('should navigate to another page', () => {
      const spy = spyOn(router, 'navigateByUrl');
      mockAuthService.login.and.returnValue(cold('(a|)', { a: {} }));
      getTestScheduler().run(() => {
        component.login();
      });
      expect(spy).toHaveBeenCalled();
    });

    it('should console.error in case of error', () => {
      const spy = spyOn(console, 'error');
      const spyNavigate = spyOn(router, 'navigateByUrl');
      mockAuthService.login.and.returnValue(
        cold('#', {}, new Error('Mistake')),
      );
      getTestScheduler().run(() => {
        component.login();
      });
      expect(spy).toHaveBeenCalled();
      expect(spyNavigate).not.toHaveBeenCalled();
    });
  });
});
