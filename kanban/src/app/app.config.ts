import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';



// Habilita o serviço HttpClient em toda a aplicação, 
// permitindo fazer requisições HTTP (chamar APIs) para um servidor backend.
import { provideHttpClient } from '@angular/common/http';

// Importa o módulo para trabalhar com Formulários Reativos, 
// permitindo criar e gerenciar formulários complexos no código TypeScript.
import { ReactiveFormsModule } from '@angular/forms';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    
    // Disponibiliza o serviço HttpClient para que os componentes 
    // possam fazer requisições a um servidor (buscar/enviar dados de uma API).
    provideHttpClient()

  ]
};
