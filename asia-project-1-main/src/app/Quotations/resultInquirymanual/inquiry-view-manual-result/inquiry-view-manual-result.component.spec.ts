import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquiryViewManualResultComponent } from './inquiry-view-manual-result.component';

describe('InquiryViewManualResultComponent', () => {
  let component: InquiryViewManualResultComponent;
  let fixture: ComponentFixture<InquiryViewManualResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InquiryViewManualResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InquiryViewManualResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
