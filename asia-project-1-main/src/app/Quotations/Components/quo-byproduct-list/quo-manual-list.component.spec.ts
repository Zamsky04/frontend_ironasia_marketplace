import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoManualListComponent } from './quo-manual-list.component';

describe('QuoManualListComponent', () => {
  let component: QuoManualListComponent;
  let fixture: ComponentFixture<QuoManualListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoManualListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuoManualListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
