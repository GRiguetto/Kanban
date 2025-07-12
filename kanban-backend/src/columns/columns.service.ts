// ARQUIVO: src/columns/columns.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; //decorator para injetar o repositório
import { Repository } from 'typeorm'; //classe Repository
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { Column } from './entities/column.entity';

@Injectable()
export class ColumnsService {
  /**
   * Injeta o repositório da entidade 'Column'.
   * O NestJS e o TypeORM cuidam de nos fornecer uma instância do repositório
   * que sabe como interagir com a tabela 'column' no banco de dados.
   * @param columnRepository - O repositório para a entidade Column.
   */
  constructor(
    @InjectRepository(Column)
    private readonly columnRepository: Repository<Column>,
  ) {}
  // NOTA: Os arrays em memória 'columns' e 'lastId' foram removidos!

  /**
   * Cria uma nova coluna no banco de dados.
   * @param createColumnDto - Os dados para a nova coluna.
   * @returns A promessa da coluna recém-criada e salva.
   */
  async create(createColumnDto: CreateColumnDto): Promise<Column> {
    // 1. Cria uma nova instância da entidade com os dados do DTO.
    const newColumn = this.columnRepository.create(createColumnDto);
    // 2. Salva a nova entidade no banco de dados. O TypeORM cuida de gerar a ID.
    return this.columnRepository.save(newColumn);
  }

  /**
   * Busca colunas do banco de dados, opcionalmente filtrando por 'boardId'.
   * @param boardId - (Opcional) A ID do quadro para filtrar.
   * @returns Uma promessa de um array de colunas.
   */
  findAll(boardId?: number): Promise<Column[]> {
    // Usa o método 'find' do repositório. A cláusula 'where' é como um filtro.
    return this.columnRepository.find({
      where: {
        boardId: boardId,
      },
    });
  }

  /**
   * Busca uma única coluna pela sua ID no banco de dados.
   * @param id - A ID da coluna a ser encontrada.
   * @returns A promessa da coluna encontrada.
   * @throws {NotFoundException} Se nenhuma coluna com a ID for encontrada.
   */
  async findOne(id: number): Promise<Column> {
    // O 'findOne' busca o primeiro registro que bate com a condição.
    const column = await this.columnRepository.findOne({ where: { id } });
    if (!column) {
      throw new NotFoundException(`Coluna com ID #${id} não encontrada.`);
    }
    return column;
  }

  /**
   * Remove uma coluna do banco de dados pela sua ID.
   * @param id - A ID da coluna a ser removida.
   * @returns Uma promessa com uma mensagem de sucesso.
   */
  async remove(id: number): Promise<{ message: string }> {
    // O 'delete' remove registros que batem com a condição e retorna um objeto de resultado.
    const result = await this.columnRepository.delete(id);
    if (result.affected === 0) {
      // Se nenhuma linha foi afetada, significa que a coluna não foi encontrada.
      throw new NotFoundException(`Coluna com ID #${id} não encontrada.`);
    }
    return { message: `Coluna com ID #${id} removida com sucesso.` };
  }

  /**
   * Atualiza os dados de uma coluna.
   * @param id - A ID da coluna a ser atualizada.
   * @param updateColumnDto - Os novos dados para a coluna.
   */
  async update(id: number, updateColumnDto: UpdateColumnDto): Promise<Column> {
    // O 'preload' primeiro carrega a entidade existente e depois mescla os novos dados.
    // É uma forma segura de fazer um 'update'.
    const column = await this.columnRepository.preload({
      id: id,
      ...updateColumnDto,
    });
    if (!column) {
      throw new NotFoundException(`Coluna com ID #${id} não encontrada.`);
    }
    // Salva a entidade atualizada de volta no banco de dados.
    return this.columnRepository.save(column);
  }
}