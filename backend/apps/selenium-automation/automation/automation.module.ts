import { Module } from '@nestjs/common';
import { AutomationService } from './automation.service';
import { AutomationController } from './automation.controller';
import { SeleniumModule } from '../common/selenium/selenium.module';

@Module({
  imports: [SeleniumModule],
  controllers: [AutomationController],
  providers: [AutomationService],
})
export class AutomationModule {}
