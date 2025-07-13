import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // Define a coluna 'email' como única, para não permitir dois usuários com o mesmo email.
  @Column({ unique: true })
  email: string;

  // A coluna 'password' irá guardar a senha CRIPTOGRAFADA.
  @Column()
  password: string;
}