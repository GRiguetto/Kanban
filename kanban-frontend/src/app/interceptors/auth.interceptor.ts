import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Injetamos o nosso AuthService para ter acesso ao token.
  const authService = inject(AuthService);
  const authToken = authService.getToken();

  // Se não houver token (ex: na página de login), a requisição segue sem alterações.
  if (!authToken) {
    return next(req);
  }

  // Se houver um token, clonamos a requisição e adicionamos o cabeçalho de autorização.
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${authToken}`),
  });

  // Enviamos a nova requisição, agora com o token.
  return next(authReq);
};