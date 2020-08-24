const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const speedline = require('speedline-core');
const express = require('express');
const app = express();
// const json = require('body-parser');
const cors = require('cors');

app.use(express.json());

app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); 

    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();
});

app.get('/url',async (req,res)=>{
    // var url = req.body;
    console.log(req);
    res.end();
})


async function getIndexes(){


    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const client = await page.target().createCDPSession();
    await client.send('Performance.enable');

    // const lighthouseConfig = {
    //     port:(
    //         new URL(browser.wsEndpoint())
    //     ).port
    // }
    // const auditConfig = {
    //     extends: 'lighthouse:default',
    //     settings: {
    //         onlyAudits: [
    //         'first-meaningful-paint',
    //         'speed-index',
    //         'first-cpu-idle',
    //         'interactive',
    //         'total-blocking-time',
    //         'largest-contentful-paint'
    //         ],
    //     },
    // }
    // const {lhr:{audits}} = await lighthouse(
    //     'https://opencodeiiita.github.io/Opencode-20-LeaderBoard-Frontend/',
    //     lighthouseConfig,
    //     auditConfig
    // )

    await page.goto('http://www.geekhaven.epizy.com/GeekHaven-2020/');


    // speedline('http://www.geekhaven.epizy.com/GeekHaven-2020/').then(results => {
    //     console.log('Speed Index value:', results.speedIndex);
    // });


    var firstMean = 0;
    var performanceMetrics;


    var firstPaint = await calcPaint(page);

    async function calcPaint(page) {
        const Page = page;
        await page.screenshot({ path: './screenshots/first-paint.png' });
        return await page.evaluate(async (Page) => {
            return JSON.stringify(performance.getEntriesByName('first-paint'))
        });
    }

    firstPaint = JSON.parse(firstPaint);


    const firstContentfulPaint = JSON.parse(
        await page.evaluate(() =>
            JSON.stringify(performance.getEntriesByName('first-contentful-paint'))
        )
    );

    while (firstMean === 0) {
        performanceMetrics = await client.send('Performance.getMetrics');
        await page.waitFor(200);
        await page.screenshot({ path: './screenshots/meaninigful-paint.png' });
        firstMean = getTime('FirstMeaningfulPaint');
    }

    function getTime(name) {
        return performanceMetrics.metrics.find(el => el.name === name).value;
    }

    function getRelTime(el) {
        return getTime(el) - getTime('NavigationStart');
    }




    var firstMeaningfulPaint = getRelTime('FirstMeaningfulPaint');

    // const largestContentful = audits['largest-contentful-paint']['displayValue'];
    // const speedIndex = audits['speed-index']['displayValue'];
    // const blockingTime = audits['total-blocking-time']['displayValue'];
    // const firstCpuIdle = audits['first-cpu-idle']['displayValue'];
    // const interactive = audits['interactive']['displayValue'];

    // console.log("Largest Contentful Paint"+" : "+largestContentful +"sec");
    // console.log("Speed Index"+" : "+speedIndex +"sec");
    // console.log("Total Blocking Time"+" : "+ blockingTime+"sec");
    // console.log("First CPU Idle"+" : "+firstCpuIdle +"sec");
    // console.log("Time to Interactive"+" : "+ interactive+"sec");

    console.log("firstPaint" + " : " + firstPaint[0].startTime / 1000 + "sec");
    console.log("firstContentfulPaint" + " : " + firstContentfulPaint[0].startTime / 1000 + "sec");
    console.log("firstMeaningfulPaint" + " : " + firstMeaningfulPaint + "sec");



    await browser.close();
};

app.listen(4000,()=>{
    console.log("Listening on port 4000")
})