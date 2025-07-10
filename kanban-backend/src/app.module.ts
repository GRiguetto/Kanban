import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { BoardsModule } from './boards/boards.module';
import { ColumnsModule } from './columns/columns.module';
import { CardsModule } from './cards/cards.module';

@Module({
  imports: [TasksModule, BoardsModule, ColumnsModule, CardsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
