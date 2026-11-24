import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable} from 'rxjs';
import { Student } from '../module/student';

@Injectable({
  providedIn: 'root'
  })
export class StudentService {
  private apiUrl = "http://localhost:8080/api/v1/student";
  constructor(private http: HttpClient) {}

  getStudents(): Observable<Student[]>{
    return this.http.get<Student[]>(`${this.apiUrl}`)
  }

  registerStudent(student: Student): Observable<Object>{
    return this.http.post(`${this.apiUrl}`, student);
  }

  updateStudent(id: number, student:Student): Observable<Object>{
    return this.http.put<Student>(`${this.apiUrl}/${id}`, student)
  }

  getStudentById(id: number): Observable<Student>{
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  deleteStudent(id:number):Observable<Object>{
    return this.http.delete(`${this.apiUrl}/${id}`)

  }
}
