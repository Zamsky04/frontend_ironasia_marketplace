import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqCuComponent } from './req-cu.component';

describe('ReqCuComponent', () => {
  let component: ReqCuComponent;
  let fixture: ComponentFixture<ReqCuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReqCuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReqCuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
