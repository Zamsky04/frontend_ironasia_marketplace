import { TestBed } from '@angular/core/testing';

import { ServChangePasswordWebService } from './serv-change-password-web.service';

describe('ServChangePasswordWebService', () => {
  let service: ServChangePasswordWebService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServChangePasswordWebService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
