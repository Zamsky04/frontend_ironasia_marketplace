import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListSearchComponent } from './product-list-search.component';

describe('ProductListSearchComponent', () => {
  let component: ProductListSearchComponent;
  let fixture: ComponentFixture<ProductListSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductListSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
