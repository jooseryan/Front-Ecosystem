import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { HomeComponent } from './components/home/home';
import { RegisterComponent } from './components/register/register';
import { SearchComponent } from './components/search/search';
import { UpdateComponent } from './components/update/update';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: 'register', component: RegisterComponent },
      { path: 'search', component: SearchComponent },
      { path: 'update/:id', component: UpdateComponent }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
