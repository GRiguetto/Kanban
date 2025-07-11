// ARQUIVO: api.ts (ou api.service.ts) CORRIGIDO

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  // --- MÉTODOS PARA OS CARDS ---
  getCards(columnId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cards?columnId=${columnId}`);
  }

  createCard(cardData: { title: string, columnId: number, badge: 'low' | 'medium' | 'high' }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cards`, cardData);
  }

  // 👇 MUDANÇA AQUI: Tornamos o tipo do parâmetro 'updates' mais robusto.
  updateCard(cardId: number, updates: { columnId: number }): Observable<any> {
    return this.http.patch(`${this.apiUrl}/cards/${cardId}`, updates);
  }
  
  deleteCard(cardId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cards/${cardId}`);
  }

  // --- MÉTODOS PARA AS COLUNAS ---
  getColumns(boardId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/columns?boardId=${boardId}`);
  }

  createColumn(columnData: { name: string; boardId: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/columns`, columnData);
  }

  deleteColumn(columnId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/columns/${columnId}`);
  }
}