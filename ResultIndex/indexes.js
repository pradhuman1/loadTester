const puppeteer = require('puppeteer');
const lightHousefuntion = require('./lightHouseIndex.js');
// const FCPpromise = require('./metricPromises/FCP.promise.js');

exports.getIndexes = async function (url) {


    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const client = await page.target().createCDPSession();
    await client.send('Performance.enable');

    await page.goto(url);


    // speedline('http://www.geekhaven.epizy.com/GeekHaven-2020/').then(results => {
    //     console.log('Speed Index value:', results.speedIndex);
    // });


    var firstMean = 0;
    var performanceMetrics;

    //firstPaint

    var firstPaint = new Promise(async function (resolve, reject) {
        try {
            var res = await calcPaint(page);
            res = res[0].startTime / 1000;
            console.log("FP : " + res);

            resolve(res);
        } catch (err) {
            reject(err);
        }
    })


    async function calcPaint(page) {
        try {
            await page.screenshot({ path: './screenshots/first-paint.png', fullPage: true });
            var time = await JSON.parse(
                await page.evaluate(async () => {
                    return JSON.stringify(performance.getEntriesByName('first-paint'))
                })
            );
        } catch (error) {
            console.log(error);
        }
        return time;
    }

    // firstContentfulPaint

    const firstContentfulPaint = new Promise(async function (resolve, reject) {
        try {
            var res = await JSON.parse(
                await page.evaluate(() =>
                    JSON.stringify(performance.getEntriesByName('first-contentful-paint'))
                )
            )
            res = res[0].startTime / 1000;
            console.log("FCP : " + res);

            resolve(res);
        } catch (err) {
            reject(err);
        }

    })

    // const firstContentfulPaint = FCPpromise(page);

    //firstMeaningfulPaint



    function getTime(name) {
        return performanceMetrics.metrics.find(el => el.name === name).value;
    }

    function getRelTime(el) {
        return getTime(el) - getTime('NavigationStart');
    }

    var firstMeaningfulPaint = new Promise(async function (resolve, reject) {
        try {
            while (firstMean === 0) {
                performanceMetrics = await client.send('Performance.getMetrics');
                await page.waitFor(200);
                await page.screenshot({ path: './screenshots/meaninigful-paint.png', fullPage: true });
                firstMean = getTime('FirstMeaningfulPaint');
            }
            var res = await getRelTime('FirstMeaningfulPaint');
            console.log("FMP : " + res);
            resolve(res);
        } catch (err) {
            reject(err)
        }

    })

    //lighthouse

    var lightIndexObj = new Promise(async function (resolve, reject) {
        try {
            var res = await lightHousefuntion.getLighthouseIndex(browser, page, url);
            console.log(res);
            resolve(res);
        } catch (err) {
            reject(err)
        }

    })


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

