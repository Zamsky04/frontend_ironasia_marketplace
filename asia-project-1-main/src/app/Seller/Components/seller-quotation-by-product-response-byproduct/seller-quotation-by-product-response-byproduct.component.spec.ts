import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerQuotationByProductResponseByproductComponent } from './seller-quotation-by-product-response-byproduct.component';

describe('SellerQuotationByProductResponseByproductComponent', () => {
  let component: SellerQuotationByProductResponseByproductComponent;
  let fixture: ComponentFixture<SellerQuotationByProductResponseByproductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerQuotationByProductResponseByproductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerQuotationByProductResponseByproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
