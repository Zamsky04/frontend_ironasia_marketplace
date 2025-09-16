import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultQuatationByProductsComponent } from './result-quatation-by-products.component';

describe('ResultQuatationByProductsComponent', () => {
  let component: ResultQuatationByProductsComponent;
  let fixture: ComponentFixture<ResultQuatationByProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultQuatationByProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultQuatationByProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
