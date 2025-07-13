// ARQUIVO: src/app/guards/auth.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  // Usamos 'inject' para obter as instâncias do nosso serviço e do router.
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificamos se o utilizador está autenticado.
  if (authService.isLoggedIn()) {
    return true; // Se sim, permite o acesso à rota.
  } else {
    // Se não, redireciona o utilizador para a página de login.
    router.navigate(['/login']);
    return false; // E bloqueia o acesso à rota atual.
  }
};