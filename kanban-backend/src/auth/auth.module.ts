// ARQUIVO: src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module'; 
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt'; 
import { JwtStrategy } from './jwt.strategy';

@Module({
  // Adicionamos os módulos que o AuthModule vai precisar usar.
  imports: [
    UsersModule,    // Para ter acesso ao UsersService.
    PassportModule, // Para integrar as estratégias de autenticação.
    
    // Configura o JwtModule, que é responsável por criar e validar os tokens.
    JwtModule.register({
      // 'secret' é a chave secreta que será usada para assinar os tokens.
      // Em um projeto real, NUNCA deixe a chave secreta aqui.
      // Ela deve vir de uma variável de ambiente (ex: process.env.JWT_SECRET).
      secret: 'qwervtyuiopasqdsfghjklçzxcvbfGABRIELFERNANDESRIGUETTOnmmdvgnbvcsxzçlkjhgfdsdapofiuytrewq', // Esta chave é o que garante a segurança dos seus tokens.
      
      // Define o tempo de expiração do token.
      signOptions: { expiresIn: '1h' }, // Ex: '1h' (1 hora), '7d' (7 dias)
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // O AuthService conterá nossa lógica de login/cadastro.
})
export class AuthModule {}