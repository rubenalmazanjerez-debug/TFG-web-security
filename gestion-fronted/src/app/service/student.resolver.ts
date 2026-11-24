import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { StudentService } from './student.service';
import { Student} from '../module/student';

@Injectable({ providedIn: 'root' })
export class StudentResolver implements Resolve<Student[]> {
  constructor(private studentService: StudentService) {}

  resolve(): Observable<Student[]> {
    return this.studentService.getStudents();
  }
}
