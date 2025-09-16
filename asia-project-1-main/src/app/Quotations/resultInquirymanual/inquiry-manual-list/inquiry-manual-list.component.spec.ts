import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquiryManualListComponent } from './inquiry-manual-list.component';

describe('InquiryManualListComponent', () => {
  let component: InquiryManualListComponent;
  let fixture: ComponentFixture<InquiryManualListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InquiryManualListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InquiryManualListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
