import { Controller, Get } from '@nestjs/common';
import { SeleniumAutomationService } from './selenium-automation.service';

@Controller()
export class SeleniumAutomationController {
  constructor(
    private readonly seleniumAutomationService: SeleniumAutomationService,
  ) {}

  @Get()
  getHello(): string {
    return this.seleniumAutomationService.getHello();
  }
}
