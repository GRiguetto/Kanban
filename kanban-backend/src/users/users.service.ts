// ARQUIVO: src/users/users.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto'; // Vamos criar este arquivo a seguir

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Cria um novo usuário no banco de dados.
   * @param createUserDto - Dados do usuário (email e senha já criptografada).
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  /**
   * Encontra um usuário pelo seu email.
   * @param email - O email do usuário a ser encontrado.
   */
  async findOne(email: string): Promise<User | null> {
  return this.userRepository.findOne({ where: { email } });
 }

 /**
   * Encontra um utilizador pela sua ID.
   * @param id - A ID do utilizador a ser encontrado.
   */
  async findOneById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
}
}