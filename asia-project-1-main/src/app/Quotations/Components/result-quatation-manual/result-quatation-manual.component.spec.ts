import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultQuatationManualComponent } from './result-quatation-manual.component';

describe('ResultQuatationManualComponent', () => {
  let component: ResultQuatationManualComponent;
  let fixture: ComponentFixture<ResultQuatationManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultQuatationManualComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResultQuatationManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
