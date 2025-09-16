import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerQuotationByProductComponent } from './seller-quotation-by-product.component';

describe('SellerQuotationByProductComponent', () => {
  let component: SellerQuotationByProductComponent;
  let fixture: ComponentFixture<SellerQuotationByProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerQuotationByProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerQuotationByProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
