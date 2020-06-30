require('chromedriver');
const chrome = require('selenium-webdriver/chrome');
const {Builder, By, until} = require('selenium-webdriver');

var driver = new Builder()
  .forBrowser('chrome')
  .setChromeOptions(
    new chrome.Options()
      .addArguments('--no-sandbox')
      .addArguments('--disable-dev-shm-usage')
      .addArguments('--lang=ru')
      .addArguments('--headless')
      .windowSize({width: 1440, height: 900})
  ).build();

driver.get('https://lvlr.ru').then(() => {
  driver.wait(
    until.elementLocated(By.xpath('//*[@id="pay_table"]/tbody/tr[1]/td[1]/input')), 10000
  ).sendKeys('user1').then(() => {
    driver.wait(
      until.elementLocated(By.xpath('//*[@id="pay_table"]/tbody/tr[2]/td[1]/input')), 10000
    ).sendKeys('user2').then(() => {
      driver.wait(
        until.elementLocated(By.xpath('//*[@id="pay_table"]/tbody/tr[1]/td[2]/input')), 10000
      ).sendKeys('1234').then(() => {
        driver.wait(
          until.elementLocated(By.xpath('//*[@id="pay_table"]/tbody/tr[2]/td[2]/input')), 10000
        ).sendKeys('7654').then(() => {
          driver.wait(
            until.elementLocated(By.xpath('//*[@id="app"]/div[1]/div/div/div/div/button[2]')), 10000
          ).click().then(() => {
            driver.wait(
              until.elementLocated(By.xpath('//*[@id="result"]/div/div/div[2]/div[2]/table/tbody/tr/td[3]')), 10000
            ).then(async () => {
              try {
                await driver.findElement(By.xpath('//*[@id="result"]/div/div/div[2]/div[2]/table/tbody/tr/td[3]'));
                console.log("\x1b[32m", 'Test successful!');
              } catch (e) {
                console.log("\x1b[31m", 'Test failed!');
              }
              driver.quit();
            });
          });
        });
      });
    });
  });
});
