import { Test, TestingModule } from '@nestjs/testing';
import { SeleniumServerController } from './selenium-server.controller';
import { SeleniumServerService } from './selenium-server.service';

describe('SeleniumServerController', () => {
  let seleniumServerController: SeleniumServerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SeleniumServerController],
      providers: [SeleniumServerService],
    }).compile();

    seleniumServerController = app.get<SeleniumServerController>(SeleniumServerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(seleniumServerController.getHello()).toBe('Hello World!');
    });
  });
});
