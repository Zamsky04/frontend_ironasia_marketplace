import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerQuotationManualResponseManualComponent } from './seller-quotation-manual-response-manual.component';

describe('SellerQuotationManualResponseManualComponent', () => {
  let component: SellerQuotationManualResponseManualComponent;
  let fixture: ComponentFixture<SellerQuotationManualResponseManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerQuotationManualResponseManualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerQuotationManualResponseManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
