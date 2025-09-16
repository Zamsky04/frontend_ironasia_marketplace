import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInquiryResultsComponent } from './view-inquiry-results.component';

describe('ViewInquiryResultsComponent', () => {
  let component: ViewInquiryResultsComponent;
  let fixture: ComponentFixture<ViewInquiryResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewInquiryResultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewInquiryResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
