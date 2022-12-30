import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../shared/services/auth.service';
import { LayoutService } from '../shared/services/layout.service';
import { ProductsComponent } from './products.component';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { randomNumber, randomString } from '@unit-tests';
import { ProductsService } from '../shared/services/products.service';
import { MatTableModule } from '@angular/material/table';

describe('ProductstableComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  const mockLayoutService = {
    observe$: of('none'),
  };
  const mockProductsService = {
    deleteProduct: jasmine.createSpy().and.returnValue(of()),
    getProducts: jasmine.createSpy().and.returnValue(of()),
  };
  let id = 'bn';
  let event: PageEvent = {
    pageIndex: randomNumber(),
    pageSize: randomNumber(),
    length: randomNumber(),
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductsComponent],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatDialogModule,
        MatTableModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: LayoutService, useValue: mockLayoutService },
        { provide: ProductsService, useValue: mockProductsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('`ngOnInit` should call getProducts', () => {
    const spy = spyOn(component, 'getProducts');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('`onPage` should store currentPageIndex and currentPageSize, should call getProducts', () => {
    const spy = spyOn(component, 'getProducts');
    component.onPage(event);
    expect(spy).toHaveBeenCalled();
    expect(component.currentPageIndex).toEqual(event.pageIndex);
    expect(component.currentPageSize).toEqual(event.pageSize);
    expect(component.pageIndex).toEqual(event.pageIndex);
    expect(component.pageSize).toEqual(event.pageSize);
  });

  describe('`deleteProduct`', () => {
    it(' should call deleteProduct', () => {
      const spy = spyOn(component, 'deleteProduct');
      mockProductsService.deleteProduct.and.returnValue(
        cold('(c|)', { c: 'ok' }),
      );
      getTestScheduler().run(() => {
        component.deleteProduct(id);
      });
      expect(spy).toHaveBeenCalled();
    });

    it('should console.error in case of error', () => {
      const spy = spyOn(console, 'error');
      mockProductsService.deleteProduct.and.returnValue(
        cold('#', {}, new Error('Mistake')),
      );
      getTestScheduler().run(() => {
        component.deleteProduct(id);
      });
      expect(spy).toHaveBeenCalled();
    });
  });
});
