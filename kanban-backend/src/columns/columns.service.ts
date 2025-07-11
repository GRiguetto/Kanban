// Em src/columns/columns.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { Column } from './entities/column.entity';

@Injectable()
export class ColumnsService {
  // Nosso "banco de dados" temporário para colunas
  private columns: Column[] = [
    // Vamos começar com 3 colunas padrão para cada novo quadro
    { id: 1, name: 'A Fazer', boardId: 1 },
    { id: 2, name: 'Em Andamento', boardId: 1 },
    { id: 3, name: 'Concluído', boardId: 1 },
  ];
  private lastId = 3;

  // Cria uma nova coluna
  create(createColumnDto: CreateColumnDto): Column {
    this.lastId++;
    const newColumn: Column = {
      id: this.lastId,
      name: createColumnDto.name,
      boardId: createColumnDto.boardId, // Por enquanto, vamos assumir boardId: 1
    };
    this.columns.push(newColumn);
    return newColumn;
  }

  // Encontra todas as colunas de um determinado quadro (board)
  findAll(boardId?: number): Column[] { // Adicionamos o '?' para tornar o parâmetro opcional
    if (boardId) {
      // Se um boardId for fornecido, filtramos as colunas
      return this.columns.filter(column => column.boardId === boardId);
    }// Se nenhum boardId for fornecido, retornamos todas as colunas
    return this.columns;
  }

  // Encontra uma coluna específica pela ID
  findOne(id: number): Column {
    const column = this.columns.find((column) => column.id === id);
    if (!column) {
      throw new NotFoundException(`Column with ID "${id}" not found`);
    }
    return column;
  }

  // Remove uma coluna pela ID
  remove(id: number) {
    const columnIndex = this.columns.findIndex((column) => column.id === id);
    if (columnIndex === -1) {
      throw new NotFoundException(`Column with ID "${id}" not found`);
    }
    this.columns.splice(columnIndex, 1);
    // Retorna uma mensagem de sucesso
    return { message: `Column with ID #${id} removed successfully` };
  }

  // O método de update não é necessário por enquanto
  update(id: number, updateColumnDto: UpdateColumnDto) {
    return `This action updates a #${id} column`;
  }
}