// ARQUIVO: src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

/**
 * AuthService
 * Este serviço gere todas as operações de autenticação do lado do cliente,
 * como fazer login, registar, guardar e obter o token de autenticação.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // A URL base para os endpoints de autenticação do nosso backend.
  private readonly apiUrl = 'http://localhost:3000/auth';

  // A chave que usaremos para guardar o token no localStorage.
  private readonly authTokenKey = 'kanban_auth_token';

  /**
   * Injeta o HttpClient, o serviço padrão do Angular para fazer requisições web.
   * @param http - A instância do HttpClient.
   */
  constructor(private http: HttpClient) { }

  /**
   * Envia as credenciais para o endpoint de login da API.
   * Se o login for bem-sucedido, guarda o token recebido.
   * @param credentials - Um objeto com o email e a password do utilizador.
   * @returns Um Observable com a resposta do backend, que contém o access_token.
   */
  login(credentials: any): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      // O operador 'tap' permite-nos executar uma ação secundária (como guardar o token)
      // sem interferir com a resposta que é passada para o componente.
      tap(response => {
        this.saveToken(response.access_token);
      })
    );
  }

  /**
   * Envia os dados de um novo utilizador para o endpoint de registo da API.
   * @param userData - Um objeto com o email e a password do novo utilizador.
   * @returns Um Observable com a resposta do backend.
   */
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  /**
   * Salva o token JWT no localStorage do navegador.
   * O localStorage é um armazenamento persistente, o que significa que o token
   * continuará lá mesmo se o utilizador fechar o navegador.
   * @param token - O token JWT (string) recebido da API.
   */
  saveToken(token: string): void {
    localStorage.setItem(this.authTokenKey, token);
  }

  /**
   * Obtém o token JWT do localStorage.
   * @returns O token guardado (string) ou 'null' se não existir.
   */
  getToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  /**
   * Remove o token do localStorage. Essencialmente, faz o "logout" do utilizador no frontend.
   */
  logout(): void {
    localStorage.removeItem(this.authTokenKey);
    // No futuro, poderíamos também redirecionar o utilizador para a página de login aqui.
  }

  /**
   * Verifica se o utilizador está atualmente autenticado, checando se um token existe.
   * @returns 'true' se um token válido for encontrado, 'false' caso contrário.
   */
  isLoggedIn(): boolean {
    const token = this.getToken();
    // A dupla negação (!!) é um truque para converter um valor para um booleano.
    // Se 'token' for uma string, !!token será 'true'. Se for 'null', será 'false'.
    return !!token;
  }
}