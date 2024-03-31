import { Controller, Get } from '@nestjs/common';
import { SeleniumServerService } from './selenium-server.service';

@Controller()
export class SeleniumServerController {
  constructor(private readonly seleniumServerService: SeleniumServerService) {}

  @Get()
  getHello(): string {
    return this.seleniumServerService.getHello();
  }
}
