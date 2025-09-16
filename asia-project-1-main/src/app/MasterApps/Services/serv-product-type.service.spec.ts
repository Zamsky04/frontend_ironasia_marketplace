import { TestBed } from '@angular/core/testing';

import { ServProductTypeService } from './serv-product-type.service';

describe('ServProductTypeService', () => {
  let service: ServProductTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServProductTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
