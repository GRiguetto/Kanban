import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService, // Manteremos para o login
  ) {}

  /**
   * Registra um novo usuário, criptografando a senha.
   */
  async register(registerAuthDto: RegisterAuthDto) {
  // 1. Verifica se o usuário já existe
  const existingUser = await this.usersService.findOne(registerAuthDto.email);
  if (existingUser) {
    throw new ConflictException('Este email já está em uso.');
  }

  // 2. Criptografa a senha
  const hashedPassword = await bcrypt.hash(registerAuthDto.password, 10);

  // 3. Cria o usuário no banco de dados
  const user = await this.usersService.create({
    email: registerAuthDto.email,
    password: hashedPassword,
  });

 
  //    Nós criamos uma constante 'password' (que não vamos usar) e colocamos
  //    todo o "resto" do objeto 'user' em uma nova constante chamada 'result'.
  const { password, ...result } = user;

  // 5. Retornamos o 'result', que é o objeto do usuário sem a senha.
  return result;
}
     /**
   * Valida as credenciais do usuário e retorna um token de acesso se forem válidas.
   * @param loginAuthDto - Dados de email e senha para o login.
   */
  async login(loginAuthDto: LoginAuthDto) {
    // 1. Encontra o usuário pelo email.
    const user = await this.usersService.findOne(loginAuthDto.email);

    // 2. Compara a senha enviada com a senha criptografada no banco.
    //    Se o usuário não existir ou a senha não bater, lança um erro.
    if (!user || !(await bcrypt.compare(loginAuthDto.password, user.password))) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    // 3. Se as credenciais estiverem corretas, preparamos o "payload" do token.
    //    O payload são as informações que queremos guardar dentro do token.
    //    É uma boa prática guardar apenas o necessário, como a ID e o email do usuário.
    const payload = { sub: user.id, email: user.email };

    // 4. Geramos o token JWT e o retornamos.
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}