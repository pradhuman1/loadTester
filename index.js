const puppeteer = require('puppeteer');

(async () => {

    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    
    const client = await page.target().createCDPSession();
    await client.send('Performance.enable');

    await page.goto('https://web.dev/first-meaningful-paint/');
    await page.waitFor(1000);
    const performanceMetrics = await client.send('Performance.getMetrics');

    // const performanceTiming = JSON.parse(
    //     await page.evaluate(() => JSON.stringify(window.performance.timing))
    // );

    // const startTime = performanceTiming.navigationStart;


    // console.log(startTime);
    console.log(performanceMetrics);

    //await browser.close();
})();