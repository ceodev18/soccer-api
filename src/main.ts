import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import * as dotenv from 'dotenv';
async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');
  
  const config = new DocumentBuilder()
    .setTitle('Soccer API')
    .setDescription('The soccer API description')
    .setVersion('1.0')
    .addTag('app')
    .addTag('players')
    .addTag('teams')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
