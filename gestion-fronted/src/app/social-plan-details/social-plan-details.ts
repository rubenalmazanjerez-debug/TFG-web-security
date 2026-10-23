import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SocialPlanService, SocialPlan } from '../service/social-plan';
import { Auth } from '../service/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-social-plan-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './social-plan-details.html',
  styleUrl: './social-plan-details.css',
})
export class SocialPlanDetails implements OnInit {
  plan: SocialPlan | null = null;
  planId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private socialPlanService: SocialPlanService,
    public auth: Auth,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // Leemos el ID del plan de la URL
    this.planId = Number(this.route.snapshot.paramMap.get('planId'));
    this.loadPlan();
  }

  loadPlan(): void {
    this.socialPlanService.findById(this.planId).subscribe({
      next: (data): void => {
        this.plan = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading plan:', err);
        Swal.fire('Error', 'Plan not found', 'error');
        this.goBack();
      },
    });
  }

  // === Lógica de Roles ===
  isOwner(plan: SocialPlan): boolean {
    return plan.owner.id === this.auth.getStudentId();
  }

  isParticipant(plan: SocialPlan): boolean {
    const uid: number = this.auth.getStudentId();
    return plan.userList?.some((s) => s.id === uid) ?? false;
  }

  canJoin(plan: SocialPlan): boolean {
    return !this.isOwner(plan) && !this.isParticipant(plan);
  }

  canLeave(plan: SocialPlan): boolean {
    return !this.isOwner(plan) && this.isParticipant(plan);
  }

  // === Acciones ===
  joinPlan(): void {
    this.socialPlanService.addParticipant(this.planId, this.auth.getStudentId()).subscribe({
      next: (updatedPlan): void => {
        this.plan = updatedPlan;
        this.cdr.detectChanges();
        Swal.fire('Joined!', 'You have joined the plan', 'success');
      },
    });
  }

  leavePlan(): void {
    Swal.fire({
      title: 'Leave plan?',
      text: 'You will stop participating in this plan',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, leave',
    }).then((result) => {
      if (result.isConfirmed) {
        this.socialPlanService.removeParticipant(this.planId, this.auth.getStudentId()).subscribe({
          next: (updatedPlan) => {
            this.plan = updatedPlan;
            this.cdr.detectChanges();
            Swal.fire('Left', 'You have left the plan', 'success');
          },
        });
      }
    });
  }

  kickParticipant(studentId: number): void {
    Swal.fire({
      title: 'Remove participant?',
      text: 'This user will be removed from the plan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove',
    }).then((result) => {
      if (result.isConfirmed) {
        this.socialPlanService.removeParticipant(this.planId, studentId).subscribe({
          next: (updatedPlan) => {
            this.plan = updatedPlan;
            this.cdr.detectChanges();
            Swal.fire('Removed', 'User removed from plan', 'success');
          },
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/', this.auth.getStudentId(), 'social-plans']);
  }
}
