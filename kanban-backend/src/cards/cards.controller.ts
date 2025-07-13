import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

/**
 * Define a rota base para todos os endpoints de cards como '/cards'.
 */
@Controller('cards')
@UseGuards(JwtAuthGuard)
export class CardsController {
  /**
   * Injeta o CardsService para que seus métodos possam ser usados neste controller.
   * @param cardsService - A instância do nosso serviço de lógica de negócio para cards.
   */
  constructor(private readonly cardsService: CardsService) {}

  /**
   * Rota para CRIAR um novo card.
   * - Rota completa: POST /cards
   * @param createCardDto - Os dados para o novo card, validados pelo DTO.
   */
  @Post()
  create(@Body() createCardDto: CreateCardDto) {
    return this.cardsService.create(createCardDto);
  }

  /**
   * Rota para BUSCAR cards. Pode opcionalmente filtrar por coluna.
   * - Rota completa: GET /cards  ou  GET /cards?columnId=1
   * @param columnId - A ID da coluna para filtrar os cards (opcional).
   */
  @Get()
  findAll(@Query('columnId') columnId: string) {
    // Converte o parâmetro da URL (string) para número, se ele existir.
    const columnIdAsNumber = columnId ? parseInt(columnId, 10) : undefined;
    return this.cardsService.findAll(columnIdAsNumber);
  }

  /**
   * Rota para BUSCAR um único card pela sua ID.
   * - Rota completa: GET /cards/1
   * @param id - A ID do card a ser buscado (da URL).
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    // O '+' é um atalho para converter a string 'id' para número.
    return this.cardsService.findOne(+id);
  }

  /**
   * Rota para ATUALIZAR um card existente (ex: mover para outra coluna).
   * - Rota completa: PATCH /cards/1
   * @param id - A ID do card a ser atualizado.
   * @param updateCardDto - O corpo da requisição com os dados a serem atualizados.
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardsService.update(+id, updateCardDto);
  }

  /**
   * Rota para DELETAR um card existente.
   * - Rota completa: DELETE /cards/1
   * @param id - A ID do card a ser deletado.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardsService.remove(+id);
  }
}