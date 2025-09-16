import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordwebComponent } from './change-passwordweb.component';

describe('ChangePasswordwebComponent', () => {
  let component: ChangePasswordwebComponent;
  let fixture: ComponentFixture<ChangePasswordwebComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePasswordwebComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePasswordwebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
