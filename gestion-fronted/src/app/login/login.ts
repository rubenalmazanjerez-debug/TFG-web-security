import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../service/auth';

@Component({
  imports: [FormsModule, CommonModule, RouterModule],
  selector: 'app-login',
  standalone: true,
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  credentials = { email: '', password: '' };
  errorMessage: string = '';

  constructor(
    private auth: Auth,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  onSubmit() {
    this.errorMessage = '';
    this.auth.login(this.credentials).subscribe({
      next: (res): void => {
        localStorage.setItem('student', JSON.stringify(res));
        this.router.navigate(['/', res.student.id, 'social-plans']);
      },
      error: () => {
        this.errorMessage = 'Incorrect email or password';
      },
    });
  }
}
