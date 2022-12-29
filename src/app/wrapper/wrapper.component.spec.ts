import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapperComponent } from './wrapper.component';
import { AuthService } from '../shared/services/auth.service';
import { LayoutService } from '../shared/services/layout.service';
import { of } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { mockUser } from '@unit-tests';
import { cold, getTestScheduler } from 'jasmine-marbles';

describe('WrapperComponent', () => {
  let component: WrapperComponent;
  let fixture: ComponentFixture<WrapperComponent>;
  let router: Router;
  const mockLayoutService = {
    observe$: of('none'),
  };
  const mockAuthService = {
    getProfile: jasmine.createSpy().and.returnValue(of()),
    logout: jasmine.createSpy(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WrapperComponent],
      imports: [MatMenuModule, RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: LayoutService, useValue: mockLayoutService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WrapperComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();

    mockAuthService.logout.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('`ngOnInit` should call getProfile', () => {
    const spy = spyOn(component, 'getProfile');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('`logout` should nullify profile and call logout', () => {
    const spy = spyOn(router, 'navigateByUrl');
    component.profile = mockUser();
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
    expect(component.profile).toBeNull();
  });

  describe('`getProfile`', () => {
    it('should assign profile from AuthService.getProfile', () => {
      const profile = mockUser();
      mockAuthService.getProfile.and.returnValue(cold('(c|)', { c: profile }));
      getTestScheduler().run(() => {
        component.getProfile();
      });
      expect(component.profile).toEqual(profile);
      expect(mockAuthService.logout).not.toHaveBeenCalled();
    });

    it('should console.error in case of error', () => {
      const spy = spyOn(console, 'error');
      mockAuthService.getProfile.and.returnValue(
        cold('#', {}, new Error('Mistake')),
      );
      getTestScheduler().run(() => {
        component.getProfile();
      });
      expect(component.profile).toBeNull();
      expect(spy).toHaveBeenCalled();
    });
  });
});
