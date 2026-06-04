import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { SeedService } from "./seed.service";

async function runSeed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const seedService = app.get(SeedService);
  await seedService.seed();

  await app.close();

  console.log("🌱 Seed script finished");
}

runSeed();