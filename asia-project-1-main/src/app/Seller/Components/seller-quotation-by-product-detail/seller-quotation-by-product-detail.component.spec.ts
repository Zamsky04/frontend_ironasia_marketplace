import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerQuotationByProductDetailComponent } from './seller-quotation-by-product-detail.component';

describe('SellerQuotationByProductDetailComponent', () => {
  let component: SellerQuotationByProductDetailComponent;
  let fixture: ComponentFixture<SellerQuotationByProductDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerQuotationByProductDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerQuotationByProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
