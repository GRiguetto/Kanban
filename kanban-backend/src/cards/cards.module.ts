import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';

/**
 * O decorator @Module() organiza o código relacionado à funcionalidade de Cards.
 */
@Module({
  // 'controllers': Define os controllers que lidam com as rotas da web para os cards.
  controllers: [CardsController],

  // 'providers': Define os serviços que contêm a lógica de negócio dos cards.
  // O CardsController usará o CardsService.
  providers: [CardsService],
})
export class CardsModule {}