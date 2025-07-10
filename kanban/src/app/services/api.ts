// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // A URL base do bakend NestJS
  private readonly apiUrl = 'http://localhost:3000';

  // Injeta o HttpClient para fazer as chamadas HTTP
  constructor(private http: HttpClient) { }

  // --- MÉTODOS PARA OS CARDS ---

  // Busca todos os cards de uma coluna específica
  getCards(columnId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cards?columnId=${columnId}`);
  }

  // Cria um novo card
  createCard(cardData: { title: string, columnId: number, badge: 'low' | 'medium' | 'high' }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cards`, cardData);

  }

   updateCard(cardId: number, updates: { columnId?: number; title?: string }): Observable<any> {
    return this.http.patch(`${this.apiUrl}/cards/${cardId}`, updates);}
  
    deleteCard(cardId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cards/${cardId}`);
  }
    
  
}