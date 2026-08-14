import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeedService } from './seed.service';

async function runSeed(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const seedService = app.get(SeedService);
    await seedService.seed();
    console.log('🌱 Seed script finished');
  } finally {
    await app.close();
  }
}

runSeed().catch((error: unknown) => {
  console.error('Seed script failed', error);
  process.exitCode = 1;
});
