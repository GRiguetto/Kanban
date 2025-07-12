// Importa os decorators necessários do TypeORM.
import { Entity, PrimaryGeneratedColumn, Column as OrmColumn } from 'typeorm';
// Renomeamos 'Column' para 'OrmColumn' para evitar conflito com o nome da nossa classe.

/**
 * O decorator @Entity() marca esta classe como uma entidade do TypeORM.
 * Isso significa que ela será mapeada para uma tabela no banco de dados.
 * Por padrão, o nome da tabela será o nome da classe em minúsculas: 'column'.
 */
@Entity()
export class Column {
  /**
   * @PrimaryGeneratedColumn() define esta propriedade como a chave primária da tabela.
   * O banco de dados irá gerar automaticamente um valor numérico único e incremental
   * para cada nova coluna criada (1, 2, 3, ...).
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * @Column() marca esta propriedade como uma coluna padrão na nossa tabela.
   * Por padrão, o TypeORM irá inferir o tipo da coluna no banco de dados
   * (neste caso, VARCHAR para uma string).
   */
  @OrmColumn()
  name: string;

  /**
   * @Column() para a ID do quadro ao qual esta coluna pertence.
   * No futuro, isso se tornará uma relação (foreign key) com uma entidade 'Board'.
   */
  @OrmColumn()
  boardId: number;
}