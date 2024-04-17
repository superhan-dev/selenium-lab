import { Injectable } from '@nestjs/common';
import { ExecuteDeferDto } from './dto/execute-defer.dto';
import { WebDriver, By, until } from 'selenium-webdriver';
import { SeleniumService } from '../common/selenium/selenium.service';
import { addNWeeks } from '../common/helpers/date.helpers';
import { ConfigService } from '@nestjs/config';
import { writeFileSync } from 'fs';
import { cropImage } from '../common/helpers/sharp.helpers';
import { TakeWhatsOnScreenShotDto } from './dto/take-whats-on-screen-shot.dto';
import { SearchWhatsOnActivityDto } from './dto/search-whats-on-activity.dto';
import { EmailSenderService } from '../email-sender/email-sender.service';
import { SendEmailDto } from '../email-sender/dto/send-email.dto';
import { RtomLoginDto } from './dto/rtom-login.dto';
import { ChangeProfileDto } from './dto/change-profile.dto';

@Injectable()
export class AutomationService {
  constructor(
    private readonly seleniumService: SeleniumService,
    private readonly configService: ConfigService,
    private readonly emailSenderService: EmailSenderService,
  ) {}

  async sendEmail(dto: SendEmailDto) {
    return await this.emailSenderService.sendEmail(dto);
  }

  async takeWhatsOnScreenShot(dto: TakeWhatsOnScreenShotDto): Promise<any> {
    const driver: WebDriver = await this.seleniumService.getDriver();

    for (let i = 0; i < dto.urls.length; i++) {
      const urlTemp = dto.urls[i].split('/');
      const title = urlTemp[urlTemp.length - 1];

      driver.get(dto.urls[i]);
      await driver.manage().window().maximize();
      await this.seleniumService.zoom(driver, 0.6); // Example zoom factor: 0.8 (20% decrease)

      const mapButton = await driver.findElements(
        By.css('button.gm-control-active gm-fullscreen-control'),
      );

      while (!mapButton) {
        console.log('waiting loading a the google map');
      }
      const screenshot = await driver.takeScreenshot();

      // Convert the screenshot to a JPG format
      const base64Data = screenshot.replace(/^data:image\/png;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      // Crop the screenshot to the bounding box of the element
      const croppedBuffer = await this.whatsOnCropImage(buffer);

      // Save the JPG file to your desired location
      writeFileSync(
        `/home/shhan/Workspace/superhan/selenium-lab/frontend/my-app/public/${title}.jpg`,
        croppedBuffer,
      );
    }

    // where this file will send?

    return 'Create a Image Successfully.';
  }

  private generateSearchUrl(
    fromDate: string,
    toDate: string,
    pageNum: string,
  ): string {
    const whatsOnUrl = this.configService.get<string>('WHATS_ON_URL');
    return `${whatsOnUrl}search/free+from-${fromDate}-+to-${toDate}+melbourne/page-${pageNum}`;
  }

  private async getPages(driver: WebDriver, arr: string[]): Promise<string[]> {
    // Find the span elements with the class name "page"
    const pageElements = await driver.findElements(By.css('span.page'));

    for (const pe of pageElements) {
      const pageNum: string = (await pe.getText()).trim();
      arr.push(pageNum);
    }

    return arr;
  }

  private async getTitleElements(
    driver: WebDriver,
    arr: string[],
  ): Promise<string[]> {
    // 1.1 get all title per a page.
    const titleElements = await driver.findElements(By.css('h2.title'));
    for (const te of titleElements) {
      const title = (await te.getText()).trim();
      arr.push(title);
    }

    return arr;
  }

  private async getTimetableElements(
    driver: WebDriver,
    arr: string[],
  ): Promise<string[]> {
    // 1.1 get all title per a page.
    const timeTableElements = await driver.findElements(
      By.css('#date-times-table tbody'),
    );

    for (const tbody of timeTableElements) {
      console.log(tbody);
    }
    return arr;
  }

  /**
   *
   * @param fromDate yyyy-MM-dd
   * @param toDate yyyy-MM-dd
   */
  async searchWhatsOnActivity(dto: SearchWhatsOnActivityDto) {
    const firstPageNum = '1';
    const initSearchUrl: string = this.generateSearchUrl(
      dto.fromDate,
      dto.toDate,
      firstPageNum,
    );
    const driver: WebDriver = await this.seleniumService.getDriver();
    await driver.get(initSearchUrl);

    await driver.wait(until.titleIs("Search results - What's On"), 1000);

    // // Find the span elements with the class name "page"
    const pages = await this.getPages(driver, []);
    let titles = [];
    // Output the text content of each page element

    for (const page of pages) {
      console.log(page);
      if (page === firstPageNum) {
        // await this.getTitleElements(driver, contentTitles);
      } else {
        console.log(page);
        // 1. generate search url with page number
        const searchUrls: string = this.generateSearchUrl(
          dto.fromDate,
          dto.toDate,
          page,
        );

        await driver.get(searchUrls);
        titles = [...titles, await this.getTitleElements(driver, [])];
      }
    }

    const whatsOnUrl = this.configService.get<string>('WHATS_ON_URL');
    for (const title of titles) {
      const thingsToDoUrl = `${whatsOnUrl}/things-to-do/${title}`;
      await driver.get(thingsToDoUrl);
    }
    // 1.2 get a content from app
    // click a content an get the time table
    // 2. map the event with a date
    // 3. make url of the events and screen shot.

    try {
    } finally {
      // 브라우저 세션을 종료합니다.
      // await driver.quit();
    }
  }

  async testGetTimeTable() {
    const driver: WebDriver = this.seleniumService.getDriver();
    const url = 'https://whatson.melbourne.vic.gov.au/things-to-do/rising';
    await driver.get(url);

    const dates = await driver.findElements(
      By.css('#date-times-table tbody tr th'),
    );

    const arr = [];

    for (let i = 0; i < dates.length; i++) {
      const date = (await dates[i].getText()).trim();
      if (date !== '') {
        arr[i] = { ...arr[i], date: date };
      }
    }

    const times = await driver.findElements(
      By.css('#date-times-table tbody tr td ul li span[aria-hidden="true"]'),
    );

    for (let i = 0; i < times.length; i++) {
      const time = (await times[i].getText()).trim();
      if (time !== '') {
        arr[i] = { ...arr[i], time: time };
      }
    }
    console.log(arr);
  }

  async loginElsisRtom(
    driver: WebDriver,
    rtomLoginDto: RtomLoginDto,
  ): Promise<boolean> {
    await driver.get(this.configService.get<string>('ELSIS_RTOM_URL'));

    // 페이지가 로드될 때까지 기다립니다.
    await driver.wait(
      until.titleIs(
        'Meshed Group Enterprise Education Management System -- Home Page',
      ),
      1000,
    );

    await driver.get(this.configService.get<string>('ELSIS_RTOM_URL'));

    // 페이지가 로드될 때까지 기다립니다.
    await driver.wait(
      until.titleIs(
        'Meshed Group Enterprise Education Management System -- Home Page',
      ),
      1000,
    );
    // login id input : ctl00_Main_txtUsername_ECAAll
    const usernameInput = await driver.findElement(
      By.id('ctl00_Main_txtUsername_ECAAll'),
    );
    // password input: ctl00_Main_txtPassword_ECAAll
    const passwordInput = await driver.findElement(
      By.id('ctl00_Main_txtPassword_ECAAll'),
    );

    await usernameInput.sendKeys(rtomLoginDto.username);
    await passwordInput.sendKeys(rtomLoginDto.password);

    await this.clickElementBy(driver, By.id('ctl00_Main_btnLogin_ECAAll'));
    await this.clickElementBy(driver, By.id('ctl00_Main_btnIMfine'));

    return true;
  }

  async searchStudentProfile(
    driver: WebDriver,
    studentNumber: string,
  ): Promise<void> {
    await this.clickElementBy(driver, By.id('ctl00_lnkSS'));

    const studentIdInput = await driver.findElement(
      By.id('ctl00_Main_txtSearch'),
    );

    await studentIdInput.sendKeys(studentNumber);

    await this.clickElementBy(driver, By.id('ctl00_Main_btnSearch'));
    // viewProfileBtn click
    await this.clickElementBy(
      driver,
      By.id('ctl00_Main_GridView1_ctl02_imgView'),
    );
  }

  /**
   * OOP_TIPS:
   * According to LSP(Liskov substitution principle), the dto can be substitude ChangeProfileDto for RtomLoginDto.
   * Bcause, ChangeProfileDto has already extended RtomLoginDto.
   * @param changeProfileDto
   */
  async changeProfile(changeProfileDto: ChangeProfileDto): Promise<void> {
    const driver: WebDriver = await this.seleniumService.getDriver();

    await this.loginElsisRtom(driver, changeProfileDto);
    await this.searchStudentProfile(driver, changeProfileDto.studentNumber);

    await this.clickElementBy(driver, By.id('ctl00_Main_liViewEditProfile'));
    await this.clickElementBy(driver, By.id('ctl00_Main_btnEditPersonal'));
  }

  async clickElementBy(driver: WebDriver, by: By): Promise<void> {
    await driver.wait(until.elementLocated(by), 1000);
    const element = await driver.findElement(by);
    if (element) {
      await element.click();
    }
  }

  async sendKeysElementBy(
    driver: WebDriver,
    by: By,
    value: any,
  ): Promise<void> {
    await driver.wait(until.elementLocated(by), 1000);
    const element = await driver.findElement(by);
    await element.sendKeys(value);
  }

  async getElementTextBy(driver: WebDriver, by: By): Promise<string> {
    return await driver.findElement(by).getText();
  }

  async executeDefer(executeDeferDto: ExecuteDeferDto): Promise<any> {
    const driver: WebDriver = await this.seleniumService.getDriver();

    try {
      // TODO: need to move this in configuration variable
      // 웹사이트로 이동합니다.
      await this.loginElsisRtom(driver, {
        username: 'mel.intern2',
        password: '3Varosej',
      });
      // studentManu click
      await this.clickElementBy(driver, By.id('ctl00_lnkSS'));

      await this.sendKeysElementBy(
        driver,
        By.id('ctl00_Main_txtSearch'),
        executeDeferDto.studentNumber,
      );

      // searchBtn click
      await this.clickElementBy(driver, By.id('ctl00_Main_btnSearch'));
      // viewProfileBtn click
      await this.clickElementBy(
        driver,
        By.id('ctl00_Main_GridView1_ctl02_imgView'),
      );

      const updatePanel = await driver.findElement(
        By.id('ctl00_Main_UpdatePanel1'),
      );

      if (updatePanel) {
        console.log('success to access the summary');
      }

      const studyStartDate = await this.getElementTextBy(
        driver,
        By.id('ctl00_Main_GridView2_ctl02_lblCstartDate'),
      );

      const studyEndDate = await this.getElementTextBy(
        driver,
        By.id('ctl00_Main_GridView2_ctl02_lblCfinishDate'),
      );

      console.log(
        `studyStartDate : ${studyStartDate} \n studyEndDate : ${studyEndDate}`,
      );
      const n = 3;

      const newCourseEndDate: string = addNWeeks(studyEndDate, n);

      await this.clickElementBy(driver, By.id('ctl00_Main_btnDefer'));

      // typeSelectElement click
      await this.clickElementBy(driver, By.id('ctl00_Main_lstType'));

      // selected="selected" value="Approved Holiday"
      // Locate the option you want to select and click on it
      await this.clickElementBy(
        driver,
        By.xpath("//option[text()='Approved Holiday']"),
      );

      await this.clickElementBy(driver, By.id('ctl00_Main_dropReason'));

      await this.clickElementBy(
        driver,
        By.xpath("//option[text()='Personal Reason']"),
      );

      await this.sendKeysElementBy(
        driver,
        By.id('ctl00_Main_txtFromDate'),
        executeDeferDto.fromDate,
      );

      await this.sendKeysElementBy(
        driver,
        By.id('ctl00_Main_txtToDate'),
        executeDeferDto.toDate,
      );

      // approvalStatus click
      await this.clickElementBy(driver, By.id('ctl00_Main_rbApproval_0'));

      // checkUpdateFinishDate click
      await this.clickElementBy(driver, By.id('ctl00_Main_chkFinishDate'));

      // const newFinishDateInput = await driver.findElement(
      // By.id('ctl00_Main_gmFinishDate'),
      // );
      // newFinishDateInput.sendKeys(newCourseEndDate);
      await this.sendKeysElementBy(
        driver,
        By.id('ctl00_Main_gmFinishDate'),
        newCourseEndDate,
      );
      const deferralCommentes = `student takes ${n} week break, ${n} weeks remaining. and the new finish date is ${newCourseEndDate}`;

      // commentsTextarea sendKeys
      await this.sendKeysElementBy(
        driver,
        By.name('ctl00$Main$txtComments'),
        deferralCommentes,
      );

      // const deferCourseBtn = await driver.findElement(
      //   By.name('ctl00_Main_btnDefer'),
      // );
      // deferCourseBtn.click();
    } finally {
      // 브라우저 세션을 종료합니다.
      await driver.quit();
    }

    return 'OK';
  }

  // Function to crop an image to a specified rectangle
  private async whatsOnCropImage(imageBuffer) {
    const rect = {
      left: 610,
      top: 148,
      width: 610,
      height: 660,
    };
    return await cropImage(imageBuffer, rect);
  }
}
