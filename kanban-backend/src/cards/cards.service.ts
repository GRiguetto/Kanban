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
  update(id: number, updateCardDto: UpdateCardDto): Card {
    // --- INÍCIO DA DEPURAÇÃO ---
    console.log('--- Backend: Update Card ---');
    console.log('ID do Card a ser atualizado:', id);
    console.log('Dados recebidos do frontend (updateCardDto):', updateCardDto);
    // -----------------------------

    const cardToUpdate = this.findOne(id);

    // --- DEPURAÇÃO ---
    console.log('Card encontrado no "banco de dados" antes da atualização:', cardToUpdate);
    // -----------------

    const updatedCard = Object.assign(cardToUpdate, updateCardDto);

    // --- DEPURAÇÃO FINAL ---
    console.log('Card DEPOIS da atualização (antes de salvar):', updatedCard);
    // -----------------------

    const cardIndex = this.cards.findIndex(card => card.id === id);
    this.cards[cardIndex] = updatedCard;

    return updatedCard;
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