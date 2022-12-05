import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductstableComponent } from './productstable.component';

describe('ProductstableComponent', () => {
  let component: ProductstableComponent;
  let fixture: ComponentFixture<ProductstableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductstableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductstableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
