import { Component } from '@angular/core';
import { Student } from '../module/student';
import { StudentService } from '../service/student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth} from '../service/auth';

@Component({
  imports: [FormsModule, CommonModule],
  selector: 'app-update-student',
  standalone: true,
  styleUrl: './update-student.css',
  templateUrl: './update-student.html',
})
export class UpdateStudent {
  id: number;
  student: Student = new Student();
  constructor(
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: Auth
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.studentService
      .getStudentById(this.id)
      .pipe(
        tap((dato) => {
          this.student = dato;
        }),
        catchError((error) => {
          console.error(error);
          return of(null);
        }),
      )
      .subscribe();
  }

  goToStudentList() {
    this.router.navigate(['/', this.auth.getStudentId(), 'students']);
    Swal.fire(
      'Student updated',
      `The student ${this.student.name} has been updated with success`,
      'success',
    );
  }

  onSubmit(): void {
    if (this.student) {
      this.studentService
        .updateStudent(this.id, this.student)
        .pipe(
          tap((dato) => {
            this.goToStudentList();
          }),
          catchError((error) => {
            console.error('Error while updating student: ', error);
            return of(null);
          }),
        )
        .subscribe();
    }
  }
}
