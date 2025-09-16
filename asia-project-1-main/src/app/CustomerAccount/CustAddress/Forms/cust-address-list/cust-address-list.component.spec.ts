import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustAddressListComponent } from './cust-address-list.component';

describe('CustAddressListComponent', () => {
  let component: CustAddressListComponent;
  let fixture: ComponentFixture<CustAddressListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustAddressListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustAddressListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
