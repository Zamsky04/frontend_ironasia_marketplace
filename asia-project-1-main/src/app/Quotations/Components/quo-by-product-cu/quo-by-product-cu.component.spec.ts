import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoByProductCuComponent } from './quo-by-product-cu.component';

describe('QuoByProductCuComponent', () => {
  let component: QuoByProductCuComponent;
  let fixture: ComponentFixture<QuoByProductCuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoByProductCuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuoByProductCuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
