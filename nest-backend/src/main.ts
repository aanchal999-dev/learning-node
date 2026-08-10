import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips any properties not declared in the DTO
      forbidNonWhitelisted: true, // Throws an error if extra properties are sent
      transform: true, // Automatically converts payloads to DTO instances
    }),
  );

  const port = process.env.PORT;
  if (!port) {
    throw new Error('PORT environment variable is missing');
  }

  await app.listen(port);
}
bootstrap();
