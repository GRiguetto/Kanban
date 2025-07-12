import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from './entities/card.entity';

@Injectable()
export class CardsService {
  /**
   * Injeta o repositório da entidade 'Card' para interagir com a tabela 'card'.
   * @param cardRepository - O repositório para a entidade Card.
   */
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}
  // NOTA: Os arrays em memória 'cards' e 'lastId' foram removidos!

  /**
   * Cria um novo card no banco de dados.
   * @param createCardDto - Os dados para o novo card.
   * @returns A promessa do card recém-criado e salvo.
   */
  async create(createCardDto: CreateCardDto): Promise<Card> {
    const newCard = this.cardRepository.create(createCardDto);
    return this.cardRepository.save(newCard);
  }

  /**
   * Busca cards do banco de dados, opcionalmente filtrando por 'columnId'.
   * @param columnId - (Opcional) A ID da coluna para filtrar.
   * @returns Uma promessa de um array de cards.
   */
  findAll(columnId?: number): Promise<Card[]> {
    return this.cardRepository.find({
      where: {
        columnId: columnId,
      },
    });
  }

  /**
   * Busca um único card pela sua ID no banco de dados.
   * @param id - A ID do card a ser encontrado.
   * @returns A promessa do card encontrado.
   * @throws {NotFoundException} Se o card não for encontrado.
   */
  async findOne(id: number): Promise<Card> {
    const card = await this.cardRepository.findOne({ where: { id } });
    if (!card) {
      throw new NotFoundException(`Card com ID #${id} não encontrado.`);
    }
    return card;
  }

  /**
   * Atualiza os dados de um card no banco de dados.
   * @param id - A ID do card a ser atualizado.
   * @param updateCardDto - Os novos dados para o card.
   * @returns A promessa do card com os dados atualizados.
   */
  async update(id: number, updateCardDto: UpdateCardDto): Promise<Card> {
    // 'preload' carrega a entidade existente e mescla os novos dados.
    // É uma forma segura de fazer um 'update'.
    const card = await this.cardRepository.preload({
      id: id,
      ...updateCardDto,
    });
    if (!card) {
      throw new NotFoundException(`Card com ID #${id} não encontrado.`);
    }
    return this.cardRepository.save(card);
  }

  /**
   * Remove um card do banco de dados pela sua ID.
   * @param id - A ID da coluna a ser removida.
   * @returns Uma promessa com uma mensagem de sucesso.
   */
  async remove(id: number): Promise<{ message: string }> {
    const result = await this.cardRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Card com ID #${id} não encontrado.`);
    }
    return { message: `Card com ID #${id} removido com sucesso.` };
  }
}