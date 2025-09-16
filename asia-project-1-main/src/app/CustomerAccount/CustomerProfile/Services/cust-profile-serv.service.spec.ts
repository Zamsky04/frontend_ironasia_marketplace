import { TestBed } from '@angular/core/testing';

import { CustProfileServService } from './cust-profile-serv.service';

describe('CustProfileServService', () => {
  let service: CustProfileServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustProfileServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
