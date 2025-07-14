// ARQUIVO: src/app/services/api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * ApiService
 * Este serviço é o ponto central de comunicação com a API do backend para
 * todas as operações relacionadas aos dados do Kanban (Colunas e Cards).
 * Ele não lida com autenticação, apenas com os dados da aplicação.
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  /**
   * A URL base da nossa API no backend.
   * Usar uma constante aqui facilita a mudança caso a URL mude no futuro.
   */
  private readonly apiUrl = 'http://localhost:3000';

  /**
   * Injeta o HttpClient, o serviço padrão do Angular para fazer requisições web.
   * @param http - A instância do HttpClient.
   */
  constructor(private http: HttpClient) { }

  // =======================================================
  // --- MÉTODOS RELACIONADOS ÀS COLUNAS (COLUMNS) ---
  // =======================================================

  /**
   * Busca todas as colunas de um quadro (board) específico.
   * @param boardId - A ID do quadro cujas colunas queremos buscar.
   * @returns Um Observable contendo um array de colunas.
   */
  getColumns(boardId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/columns?boardId=${boardId}`);
  }

  /**
   * Cria uma nova coluna no backend.
   * @param columnData - Um objeto contendo o nome da nova coluna e a ID do quadro.
   * @returns Um Observable com a nova coluna criada pelo backend.
   */
  createColumn(columnData: { name: string; boardId: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/columns`, columnData);
  }

  /**
   * Deleta uma coluna específica pela sua ID.
   * @param columnId - A ID da coluna a ser deletada.
   * @returns Um Observable com a resposta de sucesso do backend.
   */
  deleteColumn(columnId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/columns/${columnId}`);
  }

  // =======================================================
  // --- MÉTODOS RELACIONADOS AOS CARDS (CARDS) ---
  // =======================================================

  /**
   * Busca todos os cards de uma coluna específica.
   * @param columnId - A ID da coluna cujos cards queremos buscar.
   * @returns Um Observable contendo um array de cards.
   */
  getCards(columnId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cards?columnId=${columnId}`);
  }

  /**
   * Cria um novo card no backend.
   * @param cardData - Um objeto com os dados do novo card.
   * @returns Um Observable com o novo card criado pelo backend.
   */
  createCard(cardData: { title: string, columnId: number, badge: 'low' | 'medium' | 'high' }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cards`, cardData);
  }

  /**
   * Atualiza um card existente (ex: para mover entre colunas).
   * @param cardId - A ID do card a ser atualizado.
   * @param updates - Um objeto contendo os campos a serem atualizados.
   * @returns Um Observable com o card atualizado.
   */
  updateCard(cardId: number, updates: { columnId: number }): Observable<any> {
    return this.http.patch(`${this.apiUrl}/cards/${cardId}`, updates);
  }
  
  /**
   * Deleta um card específico pela sua ID.
   * @param cardId - A ID do card a ser deletado.
   * @returns Um Observable com a resposta de sucesso do backend.
   */
  deleteCard(cardId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cards/${cardId}`);
  }

  // =======================================================
  // --- MÉTODOS NOVOS PARA O PERFIL DO UTILIZADOR (USERS) ---
  // =======================================================

  /**
   * Busca os dados do perfil do utilizador atualmente autenticado.
   * Envia uma requisição GET para o endpoint /users/me.
   * @returns Um Observable com os dados do perfil do utilizador (id, email, profileImageUrl).
   */
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/me`);
  }

  /**
   * Atualiza os dados do perfil do utilizador logado.
   * @param updates - Um objeto contendo os campos a serem atualizados (ex: { profileImageUrl: '...' }).
   * @returns Um Observable com o perfil do utilizador atualizado.
   */
  updateProfile(updates: { profileImageUrl?: string }): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/me`, updates);
  }
}