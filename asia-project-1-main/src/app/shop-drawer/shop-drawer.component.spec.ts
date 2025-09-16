import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopDrawerComponent } from './shop-drawer.component';

describe('ShopDrawerComponent', () => {
  let component: ShopDrawerComponent;
  let fixture: ComponentFixture<ShopDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopDrawerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
