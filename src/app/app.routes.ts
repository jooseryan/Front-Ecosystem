import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { HomeComponent } from './components/home/home';
import { RegisterComponent } from './components/register/register';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'home', 
    component: HomeComponent,
    children: [
      { path: 'register', component: RegisterComponent },
    ]
  },
  { path: '**', redirectTo: 'login' }
];
