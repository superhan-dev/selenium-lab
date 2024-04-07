import { Module } from '@nestjs/common';
import { AutomationService } from './automation.service';
import { AutomationController } from './automation.controller';
import { SeleniumModule } from '../common/selenium/selenium.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    SeleniumModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/selenium-automation/.env',
    }),
  ],
  controllers: [AutomationController],
  providers: [AutomationService],
})
export class AutomationModule {}
