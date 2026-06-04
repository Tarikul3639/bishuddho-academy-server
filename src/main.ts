import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from "@nestjs/platform-express";
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { join } from "path";

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(process.cwd(), 'public'));

  // Helmet security middleware with custom CSP
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],

          /* images */
          imgSrc: [
            "'self'",
            "data:",
            "https://res.cloudinary.com", // ✅ cloudinary
          ],

          /* scripts */
          scriptSrc: [
            "'self'",
            "'unsafe-inline'", // ⚠️ needed for dev / Next.js
            "https:",
          ],

          /* styles */
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            "https:",
          ],

          /* API calls */
          connectSrc: [
            "'self'",
            "http://localhost:3000", // frontend
            "https://deenseries.vercel.app", // frontend (production)
            "http://localhost:4000", // backend (if different port)
          ],

          /* iframe (YouTube etc) */
          frameSrc: [
            "'self'",
            "https://www.youtube.com",
            "https://player.vimeo.com",
          ],
        },
      },
    })
  );

  // Cookie parser middleware
  app.use(cookieParser());

  // CORS configuration
  app.enableCors({
    origin: process.env.CORS_ORIGIN, // frontend URL
    credentials: true, // MUST for cookies
  });

  // Get config service
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT')!;
  const nodeEnv = configService.get<string>('NODE_ENV');

  // Global Prefix
  app.setGlobalPrefix('api');

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1', // GET /v1/api/users     → version 1
  });

  // Global Validation Pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip unknown properties
    forbidNonWhitelisted: true, // Throw error on unknown properties
    transform: true, // Automatically transform payloads to DTO instances
  }));

  // Swagger API Documentation (only in development)
  const config = new DocumentBuilder()
    .setTitle('DeenSeries API Documentation')
    .setDescription('API documentation for DeenSeries backend')
    .setVersion('1.0')
    .addBearerAuth() // Add JWT auth support
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Listen on configured port
  await app.listen(port);

  console.log(`🚀 Server running at: http://localhost:${port}`);
  console.log(`📚 Swagger Docs: http://localhost:${port}/api/docs`);
  console.log(`🌍 Mode: ${nodeEnv}`);
}
bootstrap();
