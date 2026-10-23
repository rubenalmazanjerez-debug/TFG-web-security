import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SocialPlanDetails } from './social-plan-details';

describe('SocialPlanDetails', () => {
  let component: SocialPlanDetails;
  let fixture: ComponentFixture<SocialPlanDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialPlanDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialPlanDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
