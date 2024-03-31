import { Injectable } from '@nestjs/common';

@Injectable()
export class SeleniumServerService {
  getHello(): string {
    return 'Hello World!';
  }
}
