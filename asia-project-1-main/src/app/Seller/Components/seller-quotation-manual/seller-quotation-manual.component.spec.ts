import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerQuotationManualComponent } from './seller-quotation-manual.component';

describe('SellerQuotationManualComponent', () => {
  let component: SellerQuotationManualComponent;
  let fixture: ComponentFixture<SellerQuotationManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerQuotationManualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerQuotationManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
