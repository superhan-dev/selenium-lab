import { Test, TestingModule } from '@nestjs/testing';
import { SeleniumAutomationController } from './selenium-automation.controller';
import { SeleniumAutomationService } from './selenium-automation.service';

describe('SeleniumAutomationController', () => {
  let seleniumAutomationController: SeleniumAutomationController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SeleniumAutomationController],
      providers: [SeleniumAutomationService],
    }).compile();

    seleniumAutomationController = app.get<SeleniumAutomationController>(
      SeleniumAutomationController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(seleniumAutomationController.getHello()).toBe('Hello World!');
    });
  });
});
