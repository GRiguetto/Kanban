// ARQUIVO: src/auth/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      // Define que o token será extraído do cabeçalho de autorização como um "Bearer Token".
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Garante que o token não seja aceite se tiver expirado.
      ignoreExpiration: false,
      // A mesma chave secreta que usámos para assinar o token no auth.module.ts.
      // Em produção, isto DEVE vir de uma variável de ambiente!
      secretOrKey: 'qwervtyuiopasqdsfghjklçzxcvbfGABRIELFERNANDESRIGUETTOnmmdvgnbvcsxzçlkjhgfdsdapofiuytrewq', // mesma chave
    });
  }

  /**
   * Este método é chamado pelo PassportJS depois de ele validar a assinatura do token.
   * O 'payload' é o conteúdo que guardámos dentro do token (sub: user.id, email: user.email).
   * O que este método retorna será anexado ao objeto 'request' do Express (ex: req.user).
   */
  async validate(payload: { sub: number; email: string }) {
    // Podemos usar a ID do payload para buscar o utilizador completo no banco de dados,
    // garantindo que ele ainda existe e não foi desativado, por exemplo.
    const user = await this.usersService.findOneById(payload.sub); // Precisaremos de criar este método

    if (!user) {
      throw new UnauthorizedException('Token inválido ou utilizador não encontrado.');
    }

    // Retorna o objeto do utilizador (sem a senha) que ficará disponível na requisição.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }
}