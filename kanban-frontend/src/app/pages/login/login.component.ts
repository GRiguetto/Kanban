// ARQUIVO: src/app/pages/login/login.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// ✅ ERRO 1 - CORREÇÃO: Importamos o ReactiveFormsModule para usar formulários reativos.
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  // ✅ Garante que o ReactiveFormsModule está no array de 'imports'.
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html', // ou login.component.html
  styleUrls: ['./login.css']    // ou login.component.css
})
export class LoginComponent {
  // ✅ ERROS 2, 3, 4, 5 - CORREÇÃO: Declaramos as propriedades que o HTML vai usar.
  
  // Propriedade para o nosso formulário de login.
  loginForm: FormGroup;
  
  // Propriedade para guardar mensagens de erro para exibir na tela.
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Inicializamos o formulário no construtor.
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  /**
   * Este método é chamado quando o formulário de login é submetido.
   */
  onSubmit(): void {
    // Se o formulário for inválido, interrompemos a execução.
    if (this.loginForm.invalid) {
      return;
    }

    // Resetamos a mensagem de erro antes de uma nova tentativa.
    this.errorMessage = null;

    // Chamamos o serviço de autenticação para fazer o login.
    this.authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        console.log('Login bem-sucedido!', response);
        // Após o login, redirecionamos o utilizador para o quadro Kanban.
        this.router.navigate(['/kanban']);
      },
      error: (err: any) => {
        console.error('Erro no login:', err);
        // Em caso de erro, mostramos uma mensagem amigável.
        this.errorMessage = 'Email ou senha inválidos. Por favor, tente novamente.';
      }
    });
  }
}