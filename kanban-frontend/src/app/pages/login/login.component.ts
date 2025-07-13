// ARQUIVO: src/app/pages/login/login.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup; // ✅ NOVO: Formulário para o cadastro
  isLoginView = true; // ✅ NOVO: Controla qual formulário é exibido
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Formulário de Login (sem alterações)
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // ✅ NOVO: Inicializa o formulário de cadastro
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Alterna entre a visualização de login e cadastro.
   */
  toggleView(): void {
    this.isLoginView = !this.isLoginView;
    this.errorMessage = null; // Limpa as mensagens de erro ao trocar de formulário
    this.successMessage = null;
  }

  /**
   * Submete o formulário de login.
   */
  onLogin(): void {
    if (this.loginForm.invalid) return;
    this.errorMessage = null;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        console.log('Login bem-sucedido!', response);
        this.router.navigate(['/kanban']);
      },
      error: (err) => {
        console.error('Erro no login:', err);
        this.errorMessage = 'Email ou senha inválidos.';
      }
    });
  }

  /**
   * ✅ NOVO: Submete o formulário de cadastro.
   */
  onRegister(): void {
    if (this.registerForm.invalid) return;
    this.errorMessage = null;

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        console.log('Cadastro bem-sucedido!', response);
        this.successMessage = 'Cadastro realizado com sucesso! Faça o login para continuar.';
        this.toggleView(); // Alterna para a tela de login após o sucesso
      },
      error: (err) => {
        console.error('Erro no cadastro:', err);
        // Pega a mensagem de erro específica do backend (ex: "email já em uso")
        this.errorMessage = err.error.message || 'Não foi possível realizar o cadastro.';
      }
    });
  }
}