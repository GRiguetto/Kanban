import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent // Rota de login, PÚBLICA (sem guarda)
  },
  {
    path: 'kanban',
    component: Home,
    canActivate: [authGuard] // Rota do Kanban, PROTEGIDA
  },
  {
    path: '',
    redirectTo: '/kanban',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/kanban'
  }
];