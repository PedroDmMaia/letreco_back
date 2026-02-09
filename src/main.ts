import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function getAllowedOrigins(): string[] {
  const defaults = ['http://localhost:4200', 'https://letreco-front.vercel.app'];
  const env = process.env.CORS_ORIGIN ?? process.env.FRONTEND_URL;
  if (!env) return defaults;
  const fromEnv = env.split(',').map((s) => s.trim()).filter(Boolean);
  return [...new Set([...defaults, ...fromEnv])];
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const origins = getAllowedOrigins();
  app.enableCors({
    origin: origins.length > 0 ? origins : true,
    credentials: true,
  });
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
