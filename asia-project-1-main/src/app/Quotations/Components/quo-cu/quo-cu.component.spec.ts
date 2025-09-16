import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoCuComponent } from './quo-cu.component';

describe('QuoCuComponent', () => {
  let component: QuoCuComponent;
  let fixture: ComponentFixture<QuoCuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoCuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuoCuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
