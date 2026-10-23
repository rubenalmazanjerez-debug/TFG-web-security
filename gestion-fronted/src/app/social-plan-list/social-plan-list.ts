import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SocialPlanService, SocialPlan } from '../service/social-plan';
import { ActivityService, Activity } from '../service/activity';
import Swal from 'sweetalert2';
import { Auth } from '../service/auth';
import { RouterModule} from '@angular/router';

@Component({
  selector: 'app-social-plan-list',
  standalone: true,
  imports: [CommonModule,
            FormsModule,
            RouterModule],
  templateUrl: './social-plan-list.html',
  styleUrl: './social-plan-list.css',
})
export class SocialPlanList implements OnInit {
  plans: SocialPlan[] = [];
  showForm: boolean = false;

  newPlan: SocialPlan = {
    name: '',
    description: '',
    owner: { id: 0 },
  };

  tempActivities: Activity[] = [];
  newActivity: Activity = { name: '', description: '' };

  expandedPlanId: number | null = null;

  constructor(
    private socialPlanService: SocialPlanService,
    private activityService: ActivityService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    public auth: Auth,
  ) {}

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.socialPlanService.findAll().subscribe({
      next: (data) => {
        this.plans = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error charging plans:', err),
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.newPlan = { name: '', description: '', owner: { id: 0 } };
    this.tempActivities = [];
    this.newActivity = { name: '', description: '' };
  }

  addActivityToTemp(): void {
    if (!this.newActivity.name || !this.newActivity.name.trim()) {
      Swal.fire('Error', 'Activity must have a name', 'error');
      return;
    }
    this.tempActivities.push({ ...this.newActivity });
    this.newActivity = { name: '', description: '' };
    this.cdr.detectChanges();
  }

  removeActivityFromTemp(index: number): void {
    this.tempActivities.splice(index, 1);
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    if (!this.newPlan.name || !this.newPlan.name.trim()) {
      Swal.fire('Error', 'Social plan must have a name', 'error');
      return;
    }

    let studentId = 0;
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('student');
      if (stored) {
        studentId = JSON.parse(stored).student.id;
      }
    }

    if (!studentId) {
      Swal.fire('Error', 'We could not adress the logged user', 'error');
      return;
    }

    this.newPlan.owner = { id: studentId };

    this.socialPlanService.create(this.newPlan).subscribe({
      next: (createdPlan) => {
        if (this.tempActivities.length > 0) {
          this.createAndLinkActivities(createdPlan);
        } else {
          this.finishCreate(createdPlan);
        }
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Plan could not be created', 'error');
      },
    });
  }

  private createAndLinkActivities(plan: SocialPlan): void {
    const createPromises = this.tempActivities.map((activity) =>
      this.activityService.create(activity).toPromise(),
    );

    Promise.all(createPromises)
      .then((createdActivities) => {
        const linkPromises = createdActivities.map((act) =>
          this.socialPlanService.addActivity(plan.id!, act!.id!).toPromise(),
        );
        return Promise.all(linkPromises);
      })
      .then(() => {
        return this.socialPlanService.findById(plan.id!).toPromise();
      })
      .then((updatedPlan) => {
        if (updatedPlan) this.finishCreate(updatedPlan);
      })
      .catch((err) => {
        console.error('Error charging activities:', err);
        Swal.fire(
          'Warning',
          'The plan was created, but there was an issue with activities',
          'warning',
        );
        this.loadPlans();
      });
  }

  private finishCreate(plan: SocialPlan): void {
    this.plans = [...this.plans, plan];
    this.newPlan = { name: '', description: '', owner: { id: 0 } };
    this.tempActivities = [];
    this.newActivity = { name: '', description: '' };
    this.showForm = false;
    this.cdr.detectChanges();
    Swal.fire('Created', 'Social plan created with success', 'success');
  }

  toggleDetails(planId: number): void {
    this.expandedPlanId = this.expandedPlanId === planId ? null : planId;
  }

  deletePlan(id: number): void {
    Swal.fire({
      title: '¿Delete Plan?',
      text: 'Social Plan will be eliminated',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.socialPlanService.delete(id, this.getCurrentUserId()).subscribe({
          next: () => {
            this.plans = this.plans.filter((p) => p.id !== id);
            this.cdr.detectChanges();
            Swal.fire('Eliminated', 'Plan eliminated with success', 'success');
          },
          error: (err) => {
            console.error(err);
            Swal.fire(
              'Error',
              err.status === 403
                ? 'Only the owner can delete the social plan'
                : 'Could not be deleted',
              'error',
            );
          },
        });
      }
    });
  }

  getCurrentUserId(): number {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('student');
      if (stored) {
        return JSON.parse(stored).student.id;
      }
    }
    return 0;
  }

  isOwner(plan: SocialPlan): boolean {
    return plan.owner.id === this.getCurrentUserId();
  }

  isParticipant(plan: SocialPlan): boolean {
    const uid = this.getCurrentUserId();
    return plan.userList?.some((s) => s.id === uid) ?? false;
  }

  canJoin(plan: SocialPlan): boolean {
    return !this.isOwner(plan) && !this.isParticipant(plan);
  }

  canLeave(plan: SocialPlan): boolean {
    return !this.isOwner(plan) && this.isParticipant(plan);
  }

  joinPlan(planId: number): void {
    const studentId = this.getCurrentUserId();
    this.socialPlanService.addParticipant(planId, studentId).subscribe({
      next: (updatedPlan) => {
        const idx = this.plans.findIndex((p) => p.id === planId);
        if (idx !== -1) this.plans[idx] = updatedPlan;
        this.cdr.detectChanges();
        Swal.fire('¡Joined!', 'You have joined the social plan', 'success');
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'You could not join the social plan', 'error');
      },
    });
  }

  leavePlan(planId: number): void {
    Swal.fire({
      title: '¿Leave the plan?',
      text: 'You will stop participating in the plan',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, leave',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const studentId = this.getCurrentUserId();
        this.socialPlanService.removeParticipant(planId, studentId).subscribe({
          next: (updatedPlan) => {
            const idx = this.plans.findIndex((p) => p.id === planId);
            if (idx !== -1) this.plans[idx] = updatedPlan;
            this.cdr.detectChanges();
            Swal.fire('Left', 'You left the plan', 'success');
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'You could not leave the plan', 'error');
          },
        });
      }
    });
  }

  kickParticipant(planId: number, studentId: number): void {
    Swal.fire({
      title: 'Remove participant?',
      text: 'This user will be removed from the plan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove',
    }).then((result): void => {
      if (result.isConfirmed) {
        this.socialPlanService.removeParticipant(planId, studentId).subscribe({
          next: (updatedPlan: SocialPlan): void => {
            const idx: number = this.plans.findIndex((p: SocialPlan): boolean => p.id === planId);
            if (idx !== -1) this.plans[idx] = updatedPlan;
            this.cdr.detectChanges();
            Swal.fire('Removed', 'User removed from plan', 'success');
          },
          error: (err: any): void => {
            console.error(err);
            Swal.fire('Error', 'Could not remove user', 'error');
          },
        });
      }
    });
  }
}
