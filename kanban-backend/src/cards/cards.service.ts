import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from './entities/card.entity';

/**
 * @Injectable() marca esta classe como um "provider" que pode ser gerenciado
 * pelo sistema de Injeção de Dependência do NestJS.
 */
@Injectable()
export class CardsService {
  /**
   * Simulação de uma tabela de 'cards' em um banco de dados.
   * Em uma aplicação real, estes dados estariam em um banco de dados persistente.
   * @private
   */
  private cards: Card[] = [];

  /**
   * Mantém o controle da última ID utilizada para simular o auto-incremento.
   * @private
   */
  private lastId = 0;

  /**
   * Cria um novo card e o adiciona à nossa lista em memória.
   * @param createCardDto - Os dados para o novo card.
   * @returns O objeto do card recém-criado, completo com sua nova ID.
   */
  create(createCardDto: CreateCardDto): Card {
    this.lastId++; // Simula o auto-incremento da ID.
    const newCard: Card = {
      id: this.lastId,
      title: createCardDto.title,
      description: createCardDto.description || '', // Usa uma string vazia como padrão.
      columnId: createCardDto.columnId,
      badge: createCardDto.badge,
    };
    this.cards.push(newCard);
    return newCard;
  }

  /**
   * Busca todos os cards. Se uma `columnId` for fornecida, filtra os cards para aquela coluna.
   * @param columnId - (Opcional) A ID da coluna para filtrar.
   * @returns Um array de cards.
   */
  findAll(columnId?: number): Card[] {
    if (columnId) {
      return this.cards.filter(card => card.columnId === columnId);
    }
    return this.cards;
  }

  /**
   * Busca um único card pela sua ID.
   * @param id - A ID do card a ser encontrado.
   * @returns O objeto do card encontrado.
   * @throws {NotFoundException} Se nenhum card com a ID fornecida for encontrado.
   */
  findOne(id: number): Card {
    const card = this.cards.find(card => card.id === id);
    if (!card) {
      // Lança uma exceção padrão do NestJS, resultando em uma resposta HTTP 404.
      throw new NotFoundException(`Card com ID #${id} não encontrado.`);
    }
    return card;
  }

  /**
   * Atualiza os dados de um card existente.
   * @param id - A ID do card a ser atualizado.
   * @param updateCardDto - Os novos dados para o card.
   * @returns O card completo com os dados atualizados.
   * @throws {NotFoundException} Se o card a ser atualizado não for encontrado.
   */
  update(id: number, updateCardDto: UpdateCardDto): Card {
    // Reutiliza o findOne para garantir que o card exista antes de tentar atualizá-lo.
    const cardToUpdate = this.findOne(id);

    // Mescla as propriedades do DTO (novos dados) no objeto do card encontrado.
    // Isso atualiza apenas os campos que foram enviados na requisição.
    const updatedCard = Object.assign(cardToUpdate, updateCardDto);

    const cardIndex = this.cards.findIndex(card => card.id === id);
    this.cards[cardIndex] = updatedCard;

    return updatedCard;
  }

  /**
   * Remove um card da lista em memória pela sua ID.
   * @param id - A ID do card a ser removido.
   * @returns Uma mensagem de sucesso.
   * @throws {NotFoundException} Se o card a ser removido não for encontrado.
   */
  remove(id: number): { message: string } {
    const cardIndex = this.cards.findIndex(card => card.id === id);
    if (cardIndex === -1) {
      throw new NotFoundException(`Card com ID #${id} não encontrado.`);
    }
    this.cards.splice(cardIndex, 1);
    return { message: `Card com ID #${id} removido com sucesso.` };
  }
}