// src/cards/cards.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from './entities/card.entity';

@Injectable()
export class CardsService {
  private cards: Card[] = [];
  private lastId = 0;

  create(createCardDto: CreateCardDto): Card {
    this.lastId++;
    const newCard: Card = {
      id: this.lastId,
      title: createCardDto.title,
      description: createCardDto.description || '',
      columnId: createCardDto.columnId,
      badge: createCardDto.badge,
    };
    this.cards.push(newCard);
    return newCard;
  }

  // Vamos filtrar os cartões por coluna
  findAll(columnId?: number): Card[] {
    if (columnId) {
      return this.cards.filter(card => card.columnId === columnId);
    }
    return this.cards;
  }

  findOne(id: number): Card {
    const card = this.cards.find((card) => card.id === id);
    if (!card) {
      throw new NotFoundException(`Card with ID "${id}" not found`);
    }
    return card;
  }

  // O update será importante para mover o card de coluna
  update(id: number, updateCardDto: UpdateCardDto) {
    const card = this.findOne(id);

    // Atualiza o título se ele for enviado
    if (updateCardDto.title) {
        card.title = updateCardDto.title;
    }
    // Atualiza a descrição se ela for enviada
    if (updateCardDto.description) {
        card.description = updateCardDto.description;
    }
    // ATUALIZA A COLUNA se o columnId for enviado (é assim que movemos o card)
    if (updateCardDto.columnId) {
        card.columnId = updateCardDto.columnId;
    }

    return card;
  }

  remove(id: number) {
    const cardIndex = this.cards.findIndex((card) => card.id === id);
     if (cardIndex === -1) {
      throw new NotFoundException(`Card with ID "${id}" not found`);
    }
    this.cards.splice(cardIndex, 1);
    return { message: `Card with ID #${id} removed` };
  }
}