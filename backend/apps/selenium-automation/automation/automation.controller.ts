import { Controller, Post, Body } from '@nestjs/common';
import { AutomationService } from './automation.service';
import { ExecuteDeferDto } from './dto/execute-defer.dto';
import { ConfigService } from '@nestjs/config';

@Controller('automation')
export class AutomationController {
  constructor(
    private readonly automationService: AutomationService,
    private configService: ConfigService,
  ) {}

  @Post('defer-holiday')
  executeDefer(@Body() executeDeferDto: ExecuteDeferDto) {
    console.log(this.configService.get<string>('SELENIUM_WEB_URL'));
    return executeDeferDto;
    // return this.automationService.executeDefer(executeDeferDto);
  }
}
