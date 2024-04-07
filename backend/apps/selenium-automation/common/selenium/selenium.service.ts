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

  async zoom(driver: WebDriver, zoomFactor: number): Promise<void> {
    await driver.executeScript(`document.body.style.zoom = '${zoomFactor}'`);
  }
}
