import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Habilita o CORS para que o Angular (na porta 4200) possa fazer requisições
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
