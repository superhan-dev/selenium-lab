import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Builder, WebDriver } from 'selenium-webdriver';

@Injectable()
export class SeleniumService implements OnApplicationShutdown {
  private driver: WebDriver;

  constructor() {
    this.driver = new Builder().forBrowser('chrome').build();
  }

  onApplicationShutdown(signal: string) {
    this.driver.quit();
    console.log('driver is quit', signal);
  }

  getDriver(): WebDriver {
    return this.driver;
  }
}
