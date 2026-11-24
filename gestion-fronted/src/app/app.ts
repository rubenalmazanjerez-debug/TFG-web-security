import { Component, signal, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, RouterModule, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Auth } from './service/auth';


@Component({
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    RouterModule
  ],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Social Plans');

  constructor(public auth: Auth,
              private router: Router,
              @Inject(PLATFORM_ID) private platformId: Object) {}

  logout(){
    this.auth.logout();
    this.router.navigate(['/login'])
  }

  getCurrentStudentId(): number {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('student');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return parsed.student?.id || 0;
        } catch {
          return 0;
        }
      }
    }
    return 0;
  }

}
