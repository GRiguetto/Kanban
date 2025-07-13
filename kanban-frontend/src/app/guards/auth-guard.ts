// ARQUIVO: src/app/guards/auth.guard.ts (ou auth-guard.ts)

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

/**
 * authGuard é uma "Função de Guarda de Ativação" (CanActivateFn).
 * Esta é a forma moderna e funcional de proteger rotas no Angular.
 *
 * @param route - A rota futura que o utilizador está a tentar aceder.
 * @param state - O estado do router no momento da tentativa de acesso.
 * @returns 'true' se o utilizador puder aceder à rota, ou 'false' se for bloqueado.
 */
export const authGuard: CanActivateFn = (route, state) => {
  // 'inject()' é a forma moderna de obter instâncias de serviços dentro de funções como esta.
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Verificamos se o utilizador está autenticado chamando o nosso método no AuthService.
  if (authService.isLoggedIn()) {
    // 2. Se o utilizador tem um token, ele está autorizado. Retornamos 'true' para permitir o acesso.
    return true;
  } else {
    // 3. Se o utilizador não tem um token, ele não está autorizado.
    //    Nós o redirecionamos para a página de login.
    console.log('Acesso negado - redirecionando para /login');
    router.navigate(['/login']);
    
    // 4. E retornamos 'false' para bloquear a navegação para a rota protegida.
    return false;
  }
};