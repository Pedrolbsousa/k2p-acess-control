import "dotenv/config";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ? Number(process.env.PORT) : 3001;

  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.listen(process.env.PORT || 3001);
  console.log(`API esta on neste link: http://localhost:${port}`);
  console.log("ISSUER", process.env.KEYCLOAK_ISSUER);
  console.log("JWKS", process.env.KEYCLOAK_JWKS_URL);
  console.log("DATABASE_URL", process.env.DATABASE_URL);
}
bootstrap();