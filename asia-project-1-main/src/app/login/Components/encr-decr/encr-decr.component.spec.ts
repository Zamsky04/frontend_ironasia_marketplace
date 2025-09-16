import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncrDecrComponent } from './encr-decr.component';

describe('EncrDecrComponent', () => {
  let component: EncrDecrComponent;
  let fixture: ComponentFixture<EncrDecrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncrDecrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EncrDecrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
