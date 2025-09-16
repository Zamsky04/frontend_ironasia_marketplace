import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerQuotationManualDetailComponent } from './seller-quotation-manual-detail.component';

describe('SellerQuotationManualDetailComponent', () => {
  let component: SellerQuotationManualDetailComponent;
  let fixture: ComponentFixture<SellerQuotationManualDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerQuotationManualDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerQuotationManualDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
