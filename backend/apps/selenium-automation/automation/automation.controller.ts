import {
  Controller,
  Post,
  Body,
  Get,
  BadRequestException,
} from '@nestjs/common';
import { AutomationService } from './automation.service';
import { ExecuteDeferDto } from './dto/execute-defer.dto';
import { ConfigService } from '@nestjs/config';
import { TakeWhatsOnScreenShotDto } from './dto/take-whats-on-screen-shot.dto';
import { SearchWhatsOnActivityDto } from './dto/search-whats-on-activity.dto';
import { ChangeProfileDto } from './dto/change-profile.dto';

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

  @Post('capture/whats-on-activity')
  async takeWhatsOnScreenShot(
    @Body() dto: TakeWhatsOnScreenShotDto,
  ): Promise<any> {
    return await this.automationService.takeWhatsOnScreenShot(dto);
  }

  @Post('search/whats-on-activities')
  async searchWhatsOnActivity(
    @Body() dto: SearchWhatsOnActivityDto,
  ): Promise<any> {
    console.log('hello', dto);
    return await this.automationService.testGetTimeTable();
  }

  @Post('change/profile')
  async changeProfile(@Body() changeProfileDto: ChangeProfileDto) {
    return await this.automationService.changeProfile(changeProfileDto);
  }

  @Get('email-test')
  async emailTest() {
    // return await this.automationService.sendEmail();
  }

  @Get('exception-test')
  async exceptionTest() {
    throw new BadRequestException('Something bad happened', {
      // cause: new Error(),
      description: 'Some error description',
    });
  }
}
