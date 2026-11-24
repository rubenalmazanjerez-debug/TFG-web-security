import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule} from '@angular/common';
import { Student } from '../module/student';
import { ActivatedRoute } from '@angular/router';
import { Auth} from '../service/auth';
import Swal from 'sweetalert2';
import { StudentService} from '../service/student.service';


@Component({
  imports: [CommonModule],
  selector: 'app-student-list',
  standalone: true,
  styleUrl: './student-list.css',
  templateUrl: './student-list.html',
})
export class StudentList implements OnInit {
  students: Student[] = [];

  constructor(
    private route: ActivatedRoute,
    public auth: Auth,
    private cdr: ChangeDetectorRef,
    private studentService: StudentService,
  ) {}

  ngOnInit(): void {
    const allStudents: Student[] = this.route.snapshot.data['students'];
    this.students = allStudents.filter((s: Student): boolean => s.role !== 'Admin');
  }

  deleteStudent(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This user will be permanently removed from the platform.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete user',
      cancelButtonText: 'Cancel',
    }).then((result): void => {
      if (result.isConfirmed) {
        this.studentService.deleteStudent(id).subscribe({
          next: (): void => {
            this.students = this.students.filter((s: Student): boolean => s.id !== id);
            this.cdr.detectChanges();
            Swal.fire('Deleted!', 'The user has been deleted.', 'success');
          },
          error: (err: any): void => {
            console.error('Error deleting user:', err);
            const errorMsg = err.error?.message || 'Could not delete the user.';
            Swal.fire('Error', errorMsg, 'error');
          },
        });
      }
    });
  }
}
