import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://verifiedcarriers.com',
      'http://www.verifiedcarriers.com',
      'http://localhost:3000',
    ], // frontend domain
  });

  app.setGlobalPrefix('api/v1');

  // Enable CORS
  app.enableCors();

  await app.listen(4000);
}
bootstrap();
