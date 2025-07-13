import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ColumnsModule } from './columns/columns.module';
import { CardsModule } from './cards/cards.module';
import { Column } from './columns/entities/column.entity';
import { Card } from './cards/entities/card.entity';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    
    TypeOrmModule.forRoot({
      // 'type' especifica o tipo de banco de dados que estamos usando.
      type: 'sqlite',
      
      // 'database' é o nome do arquivo onde o banco de dados será salvo.
      // Ele será criado automaticamente na raiz do seu projeto backend.
      database: 'kanban.db',
      
      // 'entities' diz ao TypeORM quais classes (entidades) devem ser transformadas em tabelas no banco de dados.
      // Por enquanto, deixaremos vazio. Vamos adicionar nossas entidades nos próximos passos.
      entities: [Column, Card, User], 
      
      // 'synchronize: true' é uma opção poderosa para desenvolvimento.
      // Ele automaticamente cria e atualiza as tabelas do seu banco de dados
      // com base nas suas classes de entidade. Nunca use em produção!
      synchronize: true, 
    }),
    
    ColumnsModule,
    CardsModule,
    UsersModule,
    AuthModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}