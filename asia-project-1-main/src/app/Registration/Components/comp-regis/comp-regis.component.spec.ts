import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompRegisComponent } from './comp-regis.component';

describe('CompRegisComponent', () => {
  let component: CompRegisComponent;
  let fixture: ComponentFixture<CompRegisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompRegisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompRegisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
