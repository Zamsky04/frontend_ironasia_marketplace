import { TestBed } from '@angular/core/testing';

import { ServQuoService } from './serv-quo.service';

describe('ServQuoService', () => {
  let service: ServQuoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServQuoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
