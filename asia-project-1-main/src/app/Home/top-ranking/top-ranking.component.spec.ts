import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopRankingComponent } from './top-ranking.component';

describe('TopRankingComponent', () => {
  let component: TopRankingComponent;
  let fixture: ComponentFixture<TopRankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopRankingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
