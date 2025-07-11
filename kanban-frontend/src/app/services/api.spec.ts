import { TestBed } from '@angular/core/testing';
import { ApiService } from './api';

// Corrigido para importar o nome correto: ApiService

// Corrigido para descrever o teste correto
describe('ApiService', () => {
  // Corrigido para declarar a variável com o tipo correto
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    // Corrigido para injetar o serviço correto
    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});