import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  const configService = app.get(ConfigService);
  const port: number = configService.get<number>('PORT');
  await app.listen(port);
  console.log(`The api-gateway start with port ${port}`);
}
bootstrap();
