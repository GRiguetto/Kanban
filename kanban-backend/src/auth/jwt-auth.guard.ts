import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Este é o nosso "segurança" de rotas JWT.
 * Ao estender AuthGuard('jwt'), ele automaticamente utiliza a JwtStrategy que criamos.
 * A estratégia irá validar o token e, se for válido, permitirá o acesso à rota.
 * Se o token for inválido ou não existir, ele bloqueará a requisição com um erro 401 Unauthorized.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}