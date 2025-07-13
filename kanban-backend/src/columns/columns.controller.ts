// Importa os 'decorators' que usamos para definir as rotas e manipular a requisição/resposta.
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

/**
 * O decorator @Controller() define a rota base para todos os endpoints nesta classe.
 * Neste caso, todas as rotas aqui começarão com '/columns'.
 */
@Controller('columns')
@UseGuards(JwtAuthGuard)
export class ColumnsController {
  /**
   * O construtor injeta o ColumnsService.
   * Graças ao sistema de Injeção de Dependência do NestJS, não precisamos criar
   * uma instância do serviço manualmente. O Nest cuida disso para nós.
   * @param columnsService - A instância do nosso serviço de lógica de negócio.
   */
  constructor(private readonly columnsService: ColumnsService) {}

  /**
   * Rota para CRIAR uma nova coluna.
   * - @Post(): Define que este método responde a requisições HTTP POST.
   * - Rota completa: POST /columns
   * - @Body(): Extrai os dados do corpo (body) da requisição e os valida
   * usando o nosso DTO (Data Transfer Object).
   * @param createColumnDto - Os dados para a nova coluna.
   */
  @Post()
  create(@Body() createColumnDto: CreateColumnDto) {
    return this.columnsService.create(createColumnDto);
  }

  /**
   * Rota para BUSCAR colunas. Pode opcionalmente filtrar por quadro (board).
   * - @Get(): Define que responde a requisições HTTP GET.
   * - Rota completa: GET /columns  ou  GET /columns?boardId=1
   * - @Query('boardId'): Extrai o parâmetro de consulta 'boardId' da URL.
   * @param boardId - A ID do quadro para filtrar as colunas (opcional).
   */
  @Get()
  findAll(@Query('boardId') boardId: string) {
    // O valor da URL sempre vem como string, então convertemos para número.
    const boardIdAsNumber = boardId ? parseInt(boardId, 10) : undefined;
    return this.columnsService.findAll(boardIdAsNumber);
  }

  /**
   * Rota para BUSCAR uma única coluna pela sua ID.
   * - @Get(':id'): Define uma rota que espera um parâmetro dinâmico chamado 'id'.
   * - Rota completa: GET /columns/1
   * - @Param('id'): Extrai o parâmetro 'id' da URL.
   * @param id - A ID da coluna a ser buscada.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    // O '+' é um atalho em JavaScript para converter uma string para número.
    return this.columnsService.findOne(+id);
  }

  /**
   * Rota para ATUALIZAR uma coluna existente.
   * - @Patch(':id'): Responde a requisições HTTP PATCH.
   * - Rota completa: PATCH /columns/1
   * @param id - A ID da coluna a ser atualizada.
   * @param updateColumnDto - Os dados a serem atualizados.
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateColumnDto: UpdateColumnDto) {
    return this.columnsService.update(+id, updateColumnDto);
  }

  /**
   * Rota para DELETAR uma coluna existente.
   * - @Delete(':id'): Responde a requisições HTTP DELETE.
   * - Rota completa: DELETE /columns/1
   * @param id - A ID da coluna a ser deletada.
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.columnsService.remove(+id);
  }
}