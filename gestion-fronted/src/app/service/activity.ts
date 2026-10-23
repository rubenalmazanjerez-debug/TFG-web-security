import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Activity {
  id?: number;
  name: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private apiUrl = 'http://localhost:8080/api/v1/activity';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.apiUrl);
  }

  findById(id: number): Observable<Activity> {
    return this.http.get<Activity>(`${this.apiUrl}/${id}`);
  }

  create(activity: Activity): Observable<Activity> {
    return this.http.post<Activity>(this.apiUrl, activity);
  }

  update(id: number, activity: Activity): Observable<Activity> {
    return this.http.put<Activity>(`${this.apiUrl}/${id}`, activity);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
