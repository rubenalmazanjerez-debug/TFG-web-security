import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity } from './activity';

export interface Student {
  id: number;
  name?: string;
  surname?: string;
  email?: string;
  age?: number;
}

export interface SocialPlan {
  id?: number;
  name: string;
  description: string;
  owner: Student;
  userList?: Student[];
  activityList?: Activity[];
}

@Injectable({ providedIn: 'root' })
export class SocialPlanService {
  private apiUrl = 'http://localhost:8080/api/v1/social-plan';

  constructor(private http: HttpClient) {}

  findAll(): Observable<SocialPlan[]> {
    return this.http.get<SocialPlan[]>(this.apiUrl);
  }

  findById(id: number): Observable<SocialPlan> {
    return this.http.get<SocialPlan>(`${this.apiUrl}/${id}`);
  }

  create(plan: SocialPlan): Observable<SocialPlan> {
    return this.http.post<SocialPlan>(this.apiUrl, plan);
  }

  addParticipant(planId: number, studentId: number): Observable<SocialPlan> {
    return this.http.put<SocialPlan>(`${this.apiUrl}/${planId}/add-participant/${studentId}`, {});
  }

  removeParticipant(planId: number, studentId: number): Observable<SocialPlan> {
    return this.http.put<SocialPlan>(`${this.apiUrl}/${planId}/remove-participant/${studentId}`, {},);
  }

  addActivity(planId: number, activityId: number): Observable<SocialPlan> {
    return this.http.put<SocialPlan>(`${this.apiUrl}/${planId}/add-activity/${activityId}`, {});
  }

  delete(id: number, requesterId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}?requesterId=${requesterId}`);
  }
}
