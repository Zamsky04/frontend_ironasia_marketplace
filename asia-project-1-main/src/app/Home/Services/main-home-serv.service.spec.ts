import { TestBed } from '@angular/core/testing';

import { MainHomeServService } from './main-home-serv.service';

describe('MainHomeServService', () => {
  let service: MainHomeServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainHomeServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
