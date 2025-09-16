import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqListComponent } from './req-list.component';

describe('ReqListComponent', () => {
  let component: ReqListComponent;
  let fixture: ComponentFixture<ReqListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReqListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReqListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
