import { TestBed } from '@angular/core/testing';

import { ServRegisService } from './serv-regis.service';

describe('ServRegisService', () => {
  let service: ServRegisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServRegisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
