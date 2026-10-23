import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class Auth {
  private apiUrl: String = 'http://localhost:8080/api/v1';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  logout(): void {
    localStorage.removeItem('student');
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('student') !== null;
    }
    return false;
  }

  getStudentId(): number {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('student');
      if (stored) {
        try {
          return JSON.parse(stored).student?.id || 0;
        } catch {
          return 0;
        }
      }
    }
    return 0;
  }

  isAdmin(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('student');
      if (stored) {
        const student = JSON.parse(stored).student;
        return student.role === 'Admin';
      }
    }
    return false;
  }

}
