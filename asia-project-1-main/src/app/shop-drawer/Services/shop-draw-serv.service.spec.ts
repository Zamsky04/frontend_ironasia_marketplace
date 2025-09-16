import { TestBed } from '@angular/core/testing';

import { ShopDrawServService } from './shop-draw-serv.service';

describe('ShopDrawServService', () => {
  let service: ShopDrawServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopDrawServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
