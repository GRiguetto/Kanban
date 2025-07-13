// ARQUIVO: src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // A URL base para os endpoints de autenticação do backend.
  private readonly apiUrl = 'http://localhost:3000/auth';

  constructor(private http: HttpClient) { }

  /**
   * Envia as credenciais para o endpoint de login da API.
   * @param credentials - Um objeto com email e password.
   */
  login(credentials: any): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.saveToken(response.access_token);
      })
    );
  }

  /**
   * ✅ ESTE É O MÉTODO QUE ESTAVA A FALTAR
   * Envia os dados para o endpoint de registo da API.
   * @param userData - Um objeto com email e password.
   */
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  /**
   * Salva o token JWT no localStorage do navegador.
   * @param token - O token JWT recebido da API.
   */
  saveToken(token: string): void {
    localStorage.setItem('kanban_auth_token', token);
  }

  /**
   * Obtém o token JWT do localStorage.
   * @returns O token salvo ou null se não existir.
   */
  getToken(): string | null {
    return localStorage.getItem('kanban_auth_token');
  }

  /**
   * Remove o token do localStorage (faz o logout do utilizador).
   */
  logout(): void {
    localStorage.removeItem('kanban_auth_token');
  }

  /**
   * Verifica se o utilizador está autenticado.
   * @returns 'true' se o token existir, 'false' caso contrário.
   */
  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token;
  }
}