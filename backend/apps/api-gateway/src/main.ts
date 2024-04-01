import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  const port: number = 13001;
  await app.listen(13001);
  console.log(`The api-gateway start with port ${port}`);
}
bootstrap();
