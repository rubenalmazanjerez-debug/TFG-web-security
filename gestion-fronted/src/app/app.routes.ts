import { Routes } from '@angular/router';
import { StudentList} from './student-list/student-list';
import { RegisterStudent} from './register-student/register-student';
import { StudentResolver} from './service/student.resolver';
import { UpdateStudent } from './update-student/update-student';
import { MyProfile} from './my-profile/my-profile';
import { Login } from './login/login';
import { authGuard } from './guard/auth-guard';
import { noAuthGuard} from './guard/no-auth-guard';
import { SocialPlanList } from './social-plan-list/social-plan-list';
import { SocialPlanDetails} from './social-plan-details/social-plan-details';
import { adminGuard} from './guard/admin-guard';

export const routes: Routes = [
  { path: 'login', component: Login, canActivate: [noAuthGuard] },
  { path: 'register-student', component: RegisterStudent, canActivate: [noAuthGuard] },

  {
    path: ':idStudent',
    canActivate: [authGuard],
    children: [
      {
        path: 'students',
        component: StudentList,
        resolve: { students: StudentResolver },
        canActivate: [adminGuard],
      },
      { path: 'my-profile', component: MyProfile },
      { path: 'social-plans', component: SocialPlanList },
      { path: 'social-plans/:planId', component: SocialPlanDetails },
      { path: 'update-student/:id', component: UpdateStudent },
      { path: '', redirectTo: 'students', pathMatch: 'full' },
    ],
  },

  // Redirección por defecto
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  //  Cualquier URL no reconocida va al login
  { path: '**', redirectTo: 'login' },
];

