import { TestBed } from '@angular/core/testing';
import { SocialPlan } from './social-plan';

describe('SocialPlan', () => {
  let service: SocialPlan;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocialPlan);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
