import { TestBed } from '@angular/core/testing';

import { CustAddressServService } from './cust-address-serv.service';

describe('CustAddressServService', () => {
  let service: CustAddressServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustAddressServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
