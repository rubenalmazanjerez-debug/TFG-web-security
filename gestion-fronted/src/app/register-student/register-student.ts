import { Component, OnInit } from '@angular/core';
import { Student } from '../module/student';
import {FormsModule} from '@angular/forms';
import { StudentService } from '../service/student.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {catchError, tap, throwError} from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  imports: [FormsModule, CommonModule],
  selector: 'app-register-student',
  standalone: true,
  styleUrl: './register-student.css',
  templateUrl: './register-student.html',
})
export class RegisterStudent implements OnInit {
  student: Student = new Student();
  constructor(private studentService: StudentService,
              private router: Router) {}

  ngOnInit(): void {
    console.log(this.student);
  }

  saveStudent(): void{
    this.studentService.registerStudent(this.student).pipe(
      tap(dato => {
      console.log(dato);
      this.goToStudentList();
    }),
      catchError(error => {
        console.log(error);
        return throwError(() => new Error(error));
      })
    ).subscribe();
  }

  goToStudentList(){
    this.router.navigate(['/students'])
    Swal.fire(
      'Student registered',
      `The student ${this.student.name} has been registered with success`,
      `success`,
    );
  }

  onSubmit(): void{
    this.saveStudent();
  }
}
