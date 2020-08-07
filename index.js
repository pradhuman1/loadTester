const puppeteer = require('puppeteer');

(async () => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://github.com/');

    const performanceTiming = JSON.parse(
        await page.evaluate(() => JSON.stringify(window.performance.timing))
    );

    const startTime = performanceTiming.navigationStart;


    console.log(startTime);
    console.log(performanceTiming);

    await browser.close();
})();