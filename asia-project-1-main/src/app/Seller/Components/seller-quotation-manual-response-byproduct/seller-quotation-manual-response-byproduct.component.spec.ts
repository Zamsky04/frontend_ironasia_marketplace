import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerQuotationManualResponseByproductComponent } from './seller-quotation-manual-response-byproduct.component';

describe('SellerQuotationManualResponseByproductComponent', () => {
  let component: SellerQuotationManualResponseByproductComponent;
  let fixture: ComponentFixture<SellerQuotationManualResponseByproductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerQuotationManualResponseByproductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerQuotationManualResponseByproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
