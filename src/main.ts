import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'local'
        ? ['log', 'fatal', 'error', 'warn', 'debug', 'verbose']
        : ['error', 'log'],
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get<string>('SERVER_PORT');

  await app.listen(port);
}

bootstrap();
