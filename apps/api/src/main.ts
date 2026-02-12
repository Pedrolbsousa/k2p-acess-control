import "dotenv/config";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  await app.listen(port);
  console.log(`API listening on http://localhost:${port}`);
  console.log("ISSUER", process.env.KEYCLOAK_ISSUER);
  console.log("JWKS", process.env.KEYCLOAK_JWKS_URL);
}
bootstrap();
