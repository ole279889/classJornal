import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
import { UsersComponent } from './users';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { MarksFormComponent } from './marks';
import { AuthGuard } from './shared/guards';

const appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'marks/:id', component: MarksFormComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);