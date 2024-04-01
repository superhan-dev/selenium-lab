import { Injectable } from '@nestjs/common';
import { ExecuteDeferDto } from './dto/execute-defer.dto';
import { WebDriver, By, until } from 'selenium-webdriver';
import { SeleniumService } from '../common/selenium/selenium.service';
import { addNWeeks } from '../common/helpers/date.helpers';

@Injectable()
export class AutomationService {
  constructor(private readonly seleniumService: SeleniumService) {}

  async executeDefer(executeDeferDto: ExecuteDeferDto): Promise<any> {
    const driver: WebDriver = await this.seleniumService.getDriver();

    try {
      // TODO: need to move this in configuration variable
      // 웹사이트로 이동합니다.
      await driver.get('https://elsis.rtomanager.com.au/');

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

      await usernameInput.sendKeys('mel.intern2');
      await passwordInput.sendKeys('3Varosej');

      // login button : ctl00_Main_btnLogin_ECAAll
      const loginButton = await driver.findElement(
        By.id('ctl00_Main_btnLogin_ECAAll'),
      ); // Replace 'loginButtonId' with the actual ID of the login button
      await loginButton.click();

      const firstTimeLoginPopupBtn = await driver.findElement(
        By.id('ctl00_Main_btnIMfine'),
      );
      while (!firstTimeLoginPopupBtn) {
        console.log('waitig rendering... firstTimeLoginPopupBtn...');
      }

      if (firstTimeLoginPopupBtn) {
        await firstTimeLoginPopupBtn.click();
      }

      const studentManu = await driver.findElement(By.id('ctl00_lnkSS'));

      while (!studentManu) {
        console.log('waitig rendering... studentManu...');
      }

      if (studentManu) {
        await studentManu.click();
      }

      const studentIdInput = await driver.findElement(
        By.id('ctl00_Main_txtSearch'),
      );

      await studentIdInput.sendKeys(executeDeferDto.studentNumber);

      const searchBtn = await driver.findElement(By.id('ctl00_Main_btnSearch'));

      if (searchBtn) {
        await searchBtn.click();
      }

      const viewProfileBtn = await driver.findElement(
        By.id('ctl00_Main_GridView1_ctl02_imgView'),
      );

      if (viewProfileBtn) {
        await viewProfileBtn.click();
      }

      const updatePanel = await driver.findElement(
        By.id('ctl00_Main_UpdatePanel1'),
      );

      if (updatePanel) {
        console.log('success to access the summary');
      }

      const studyStartDate = await driver
        .findElement(By.id('ctl00_Main_GridView2_ctl02_lblCstartDate'))
        .getText();

      const studyEndDate = await driver
        .findElement(By.id('ctl00_Main_GridView2_ctl02_lblCfinishDate'))
        .getText();

      console.log(
        `studyStartDate : ${studyStartDate} \n studyEndDate : ${studyEndDate}`,
      );
      const n = 3;

      const newCourseEndDate: string = addNWeeks(studyEndDate, n);

      const deferBtn = await driver.findElement(By.id('ctl00_Main_btnDefer'));

      if (deferBtn) {
        deferBtn.click();
      }

      const typeSelectElement = await driver.findElement(
        By.id('ctl00_Main_lstType'),
      );

      typeSelectElement.click();
      // selected="selected" value="Approved Holiday"
      // Locate the option you want to select and click on it
      const optionTypeSelect = await driver.findElement(
        By.xpath("//option[text()='Approved Holiday']"),
      ); // Replace 'Option Text' with the text of the option you want to select
      await optionTypeSelect.click();

      const reasonSelect = await driver.findElement(
        By.id('ctl00_Main_dropReason'),
      );

      reasonSelect.click();

      const optionReasonSelect = await driver.findElement(
        By.xpath("//option[text()='Personal Reason']"),
      );
      optionReasonSelect.click();

      const fromDateElement = await driver.findElement(
        By.id('ctl00_Main_txtFromDate'),
      );
      const toDateElement = await driver.findElement(
        By.id('ctl00_Main_txtToDate'),
      );

      fromDateElement.sendKeys(executeDeferDto.fromDate);
      toDateElement.sendKeys(executeDeferDto.toDate);

      const approvalStatus = await driver.findElement(
        By.id('ctl00_Main_rbApproval_0'),
      );

      approvalStatus.click();

      const checkUpdateFinishDate = await driver.findElement(
        By.id('ctl00_Main_chkFinishDate'),
      );

      checkUpdateFinishDate.click();

      const newFinishDateInput = await driver.findElement(
        By.id('ctl00_Main_gmFinishDate'),
      );
      newFinishDateInput.sendKeys(newCourseEndDate);

      const commentsTextarea = await driver.findElement(
        By.name('ctl00$Main$txtComments'),
      );
      const deferralCommentes = `student takes ${n} week break, ${n} weeks remaining. and the new finish date is ${newCourseEndDate}`;

      commentsTextarea.sendKeys(deferralCommentes);

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
}
