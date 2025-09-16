import { TestBed } from '@angular/core/testing';

import { ServRequestsService } from './serv-requests.service';

describe('ServRequestsService', () => {
  let service: ServRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
