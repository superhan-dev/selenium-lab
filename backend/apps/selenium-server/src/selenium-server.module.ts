import { Module } from '@nestjs/common';
import { SeleniumServerController } from './selenium-server.controller';
import { SeleniumServerService } from './selenium-server.service';

@Module({
  imports: [],
  controllers: [SeleniumServerController],
  providers: [SeleniumServerService],
})
export class SeleniumServerModule {}
