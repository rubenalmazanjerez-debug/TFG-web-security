import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SocialPlanList } from './social-plan-list';

describe('SocialPlanList', () => {
  let component: SocialPlanList;
  let fixture: ComponentFixture<SocialPlanList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialPlanList],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialPlanList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
