import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerQuotationByProductResponseManualComponent } from './seller-quotation-by-product-response-manual.component';

describe('SellerQuotationByProductResponseManualComponent', () => {
  let component: SellerQuotationByProductResponseManualComponent;
  let fixture: ComponentFixture<SellerQuotationByProductResponseManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerQuotationByProductResponseManualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerQuotationByProductResponseManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
