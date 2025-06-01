import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://verifiedcarriers.com'], // frontend domain
    credentials: true, // if you're using cookies or Authorization headers
  });

  app.use((req, res, next) => {
    // console.log('Auth header:', req.headers.authorization);
    next();
  });

  app.setGlobalPrefix('api/v1');

  // Enable CORS
  app.enableCors();

  await app.listen(4000);
}
bootstrap();
