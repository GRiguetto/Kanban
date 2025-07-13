import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

/**
 * @Injectable() marca esta classe para ser gerida pelo sistema de
 * Injeção de Dependência do NestJS.
 */
@Injectable()
export class UsersService {
  /**
   * O construtor injeta o repositório da entidade 'User'.
   * O decorator @InjectRepository(User) diz ao TypeORM para nos fornecer
   * um objeto Repository que sabe como comunicar com a tabela 'user'.
   * @param userRepository - O repositório para a entidade User.
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Cria uma nova entidade de utilizador (sem salvar no banco ainda).
   * Este método é chamado pelo AuthService depois de a senha já ter sido criptografada.
   * @param createUserDto - Dados do utilizador (email e senha criptografada).
   * @returns A promessa do novo utilizador salvo no banco de dados.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // 1. Cria uma nova instância da entidade User com os dados fornecidos.
    const newUser = this.userRepository.create(createUserDto);
    // 2. Salva a nova instância no banco de dados e retorna o resultado.
    return this.userRepository.save(newUser);
  }

  /**
   * Encontra o primeiro utilizador que corresponde a um determinado email.
   * @param email - O email do utilizador a ser encontrado.
   * @returns A promessa do objeto User encontrado, ou 'null' se não for encontrado.
   */
  async findOne(email: string): Promise<User | null> {
    // Usa o método 'findOne' do repositório com uma cláusula 'where' para filtrar pelo email.
    return this.userRepository.findOne({ where: { email } });
  }

  /**
   * Encontra um utilizador pela sua chave primária (ID).
   * @param id - A ID do utilizador a ser encontrado.
   * @returns A promessa do objeto User encontrado, ou 'null' se não for encontrado.
   */
  async findOneById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
}