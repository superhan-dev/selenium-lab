import { Module } from '@nestjs/common';
import { SeleniumAutomationController } from './selenium-automation.controller';
import { SeleniumAutomationService } from './selenium-automation.service';
import { AutomationModule } from '../automation/automation.module';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AutomationModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [SeleniumAutomationController],
  providers: [SeleniumAutomationService],
})
export class SeleniumAutomationModule {}
