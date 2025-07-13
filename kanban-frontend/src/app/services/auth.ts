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
   * @returns Um Observable com a resposta do backend (que deve incluir o access_token).
   */
  login(credentials: any): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      // O operador 'tap' nos permite executar uma ação "secundária" sem modificar a resposta.
      // Aqui, usamos para salvar o token assim que ele chega.
      tap(response => {
        this.saveToken(response.access_token);
      })
    );
  }

  /**
   * Salva o token JWT no localStorage do navegador.
   * O localStorage permite que os dados persistam mesmo se o navegador for fechado.
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
   * Verifica se o utilizador está autenticado (se existe um token).
   * @returns 'true' se o token existir, 'false' caso contrário.
   */
  isLoggedIn(): boolean {
    const token = this.getToken();
    // A dupla negação (!!) converte o valor para um booleano puro.
    // Se o token for uma string, retorna true. Se for null, retorna false.
    return !!token;
  }
}