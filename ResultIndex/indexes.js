const puppeteer = require('puppeteer');
const lightHousefuntion = require('./lightHouseIndex.js');
const { FCPpromise } = require('./metricPromises/FCP.promise.js');
const { FPpromise } = require('./metricPromises/firstPaint.promise.js');
const { FMPpromise } = require('./metricPromises/FMP.promise.js');
const { LHpromise } = require('./metricPromises/lighthouse.promise.js');


exports.getIndexes = async function (url) {


    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const client = await page.target().createCDPSession();
    await client.send('Performance.enable');

    await page.goto(url);


    // speedline('http://www.geekhaven.epizy.com/GeekHaven-2020/').then(results => {
    //     console.log('Speed Index value:', results.speedIndex);
    // });

    const firstPaint = FPpromise(page);


    const firstContentfulPaint = FCPpromise(page);


    const firstMeaningfulPaint = FMPpromise(page, client);


    const lightIndexObj = LHpromise(browser, page, url);


    //All
    var resul;
    const indexs = function (firstMeaningfulPaint, firstPaint, firstContentfulPaint, largestContentful, speedIndex, blockingTime, firstCpuIdle, interactive) {
        this.firstContentfulPaint = firstContentfulPaint;
        this.firstPaint = firstPaint;
        this.firstMeaningfulPaint = firstMeaningfulPaint;
        this.largestContentful = largestContentful;
        this.speedIndex = speedIndex;
        this.blockingTime = blockingTime;
        this.firstCpuIdle = firstCpuIdle;
        this.interactive = interactive;
    }

    await Promise.all([firstMeaningfulPaint, firstPaint, firstContentfulPaint, lightIndexObj]).then((values) => {
        resul = new indexs(values[0], values[1], values[2], values[3].largestContentful, values[3].speedIndex, values[3].blockingTime, values[3].firstCpuIdle, values[3].interactive);
        browser.close();
    }).catch((err) => {
        console.log(err);
        browser.close();
    });
    return resul;

};

