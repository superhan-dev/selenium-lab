import { Injectable } from '@nestjs/common';

@Injectable()
export class SeleniumAutomationService {
  getHello(): string {
    return 'Hello World!';
  }
}
