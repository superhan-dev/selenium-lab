import { NestFactory } from '@nestjs/core';
import { SeleniumServerModule } from './selenium-server.module';

async function bootstrap() {
  const app = await NestFactory.create(SeleniumServerModule);
  await app.listen(14001);
}
bootstrap();
