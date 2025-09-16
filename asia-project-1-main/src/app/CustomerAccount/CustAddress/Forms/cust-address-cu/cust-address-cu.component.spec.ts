import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustAddressCUComponent } from './cust-address-cu.component';

describe('CustAddressCUComponent', () => {
  let component: CustAddressCUComponent;
  let fixture: ComponentFixture<CustAddressCUComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustAddressCUComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustAddressCUComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
