import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { Column } from './entities/column.entity';

/**
 * @Injectable() marca esta classe como um "provider" que pode ser gerenciado
 * pelo sistema de Injeção de Dependência do NestJS.
 */
@Injectable()
export class ColumnsService {
  /**
   * Simulação de um banco de dados em memória.
   * Em uma aplicação real, estes dados viriam de um banco de dados como PostgreSQL ou MongoDB.
   * Começamos com algumas colunas padrão para o quadro de ID 1.
   * @private
   */
  private columns: Column[] = [
    { id: 1, name: 'A Fazer', boardId: 1 },
    { id: 2, name: 'Em Andamento', boardId: 1 },
    { id: 3, name: 'Concluído', boardId: 1 },
  ];

  /**
   * Mantém o controle da última ID utilizada para simular o auto-incremento de um banco de dados.
   * @private
   */
  private lastId = 3;

  /**
   * Cria uma nova coluna e a adiciona à nossa lista em memória.
   * @param createColumnDto - Os dados para a nova coluna (nome e ID do quadro).
   * @returns A coluna recém-criada, completa com sua nova ID.
   */
  create(createColumnDto: CreateColumnDto): Column {
    this.lastId++; // Incrementa o contador de ID.
    const newColumn: Column = {
      id: this.lastId,
      name: createColumnDto.name,
      boardId: createColumnDto.boardId,
    };
    this.columns.push(newColumn);
    return newColumn;
  }

  /**
   * Busca todas as colunas. Se um `boardId` for fornecido, filtra as colunas para aquele quadro.
   * @param boardId - (Opcional) A ID do quadro para filtrar.
   * @returns Um array de colunas.
   */
  findAll(boardId?: number): Column[] {
    if (boardId) {
      return this.columns.filter(column => column.boardId === boardId);
    }
    return this.columns;
  }

  /**
   * Busca uma única coluna pela sua ID.
   * @param id - A ID da coluna a ser encontrada.
   * @returns O objeto da coluna encontrada.
   * @throws {NotFoundException} Se nenhuma coluna com a ID fornecida for encontrada.
   */
  findOne(id: number): Column {
    const column = this.columns.find(column => column.id === id);
    if (!column) {
      // Lançar uma exceção padrão do NestJS resulta em uma resposta HTTP 404 Not Found.
      throw new NotFoundException(`Coluna com ID #${id} não encontrada.`);
    }
    return column;
  }

  /**
   * Remove uma coluna da lista em memória pela sua ID.
   * @param id - A ID da coluna a ser removida.
   * @returns Uma mensagem de sucesso.
   * @throws {NotFoundException} Se a coluna a ser removida não for encontrada.
   */
  remove(id: number): { message: string } {
    const columnIndex = this.columns.findIndex(column => column.id === id);
    if (columnIndex === -1) {
      throw new NotFoundException(`Coluna com ID #${id} não encontrada.`);
    }
    this.columns.splice(columnIndex, 1);
    return { message: `Coluna com ID #${id} removida com sucesso.` };
  }
  
  /**
   * Atualiza os dados de uma coluna. (Funcionalidade ainda não implementada)
   * @param id - A ID da coluna a ser atualizada.
   * @param updateColumnDto - Os novos dados para a coluna.
   */
  update(id: number, updateColumnDto: UpdateColumnDto) {
    // A lógica de atualização seria implementada aqui no futuro.
    // Ex: encontrar a coluna, mesclar os novos dados e salvar.
    return `This action updates a #${id} column`;
  }
}