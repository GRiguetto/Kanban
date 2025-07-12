import { TestBed } from '@angular/core/testing';
import { ApiService } from './api';

// importar ApiService

describe('ApiService', () => {

  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});