import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { SeedService } from './seed.service';

async function runSeed() {
  const app = await NestFactory.createApplicationContext(SeedModule);

  const seedService = app.get(SeedService);

  await seedService.seed();

  await app.close();

  console.log('🌱 Seed completed successfully');
}

runSeed().catch((err) => {
  console.error('Seed script failed', err);
  process.exit(1);
});