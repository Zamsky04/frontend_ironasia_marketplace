import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabCustProfileComponent } from './tab-cust-profile.component';

describe('TabCustProfileComponent', () => {
  let component: TabCustProfileComponent;
  let fixture: ComponentFixture<TabCustProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabCustProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabCustProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
