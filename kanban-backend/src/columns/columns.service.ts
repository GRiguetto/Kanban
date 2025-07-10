// src/columns/columns.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { Column } from './entities/column.entity';


@Injectable()
export class ColumnsService {
  private columns: Column[] = [];
  private lastId = 0;

  create(createColumnDto: CreateColumnDto): Column {
    this.lastId++;
    const newColumn: Column = {
      id: this.lastId,
      name: createColumnDto.name,
      boardId: createColumnDto.boardId,
    };
    this.columns.push(newColumn);
    return newColumn;
  }

  findAll(boardId?: number): Column[] {
    if (boardId) {
      // Agora o 'boardId' existe dentro desta função
      return this.columns.filter(column => column.boardId === boardId);
    }
    return this.columns;
  }

  findOne(id: number): Column {
    const column = this.columns.find((column) => column.id === id);
    if (!column) {
      throw new NotFoundException(`Column with ID "${id}" not found`);
    }
    return column;
  }

  update(id: number, updateColumnDto: UpdateColumnDto) {
    return `This action updates a #${id} column`;
  }

  remove(id: number) {
    return `This action removes a #${id} column`;
  }
}