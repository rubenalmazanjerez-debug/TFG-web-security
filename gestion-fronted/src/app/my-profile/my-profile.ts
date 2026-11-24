import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Student } from '../module/student';
import { Auth } from '../service/auth';
import { StudentService } from '../service/student.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css',
})
export class MyProfile implements OnInit {
  student: Student | null = null;

  constructor(
    private router: Router,
    private auth: Auth,
    private studentService: StudentService,
  ) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('student');
    if (stored) {
      this.student = JSON.parse(stored).student;
    } else {
      this.router.navigate(['/login']);
    }
  }

  goToUpdate(): void {
    if (this.student) {
      this.router.navigate(['/', this.auth.getStudentId(), 'update-student', this.student.id]);
    }
  }

  goToList(): void {
    this.router.navigate(['/', this.auth.getStudentId(), 'social-plans']);
  }

  deleteMyProfile(): void {
    if (!this.student) return;

    Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete your account. You will be logged out!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete my account',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.studentService.deleteStudent(this.student!.id).subscribe({
          next: (): void => {
            this.auth.logout();
            this.router.navigate(['/login']);
            Swal.fire('Deleted!', 'Your account has been deleted successfully.', 'success');
          },
          error: (err) => {
            console.error('Error deleting account:', err);
            const errorMsg =
              err.error?.message || 'Could not delete your account. Please try again.';
            Swal.fire('Error', errorMsg, 'error');
          },
        });
      }
    });
  }
}
