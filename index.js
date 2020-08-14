const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');

(async () => {


    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    const client = await page.target().createCDPSession();
    await client.send('Performance.enable');

    const lighthouseConfig = {
        port:(
            new URL(browser.wsEndpoint())
        ).port
    }
    const auditConfig = {
        extends: 'lighthouse:default',
        settings: {
            onlyAudits: [
            'first-meaningful-paint',
            'speed-index',
            'first-cpu-idle',
            'interactive',
            'total-blocking-time',
            'largest-contentful-paint'
            ],
        },
    }
    const {lhr:{audits}} = await lighthouse(
        'https://github.com/addyosmani/puppeteer-webperf#first-contentful-paint',
        lighthouseConfig,
        auditConfig
    )

    await page.goto('https://github.com/addyosmani/puppeteer-webperf#first-contentful-paint');

    


    var firstMean = 0;
    var performanceMetrics;
    

    var firstPaint =await calcPaint(page);

    async function calcPaint(page){
        const Page = page;
        await page.screenshot({path: './screenshots/first-paint.png'});                    
        return await page.evaluate(async (Page) =>{
            return JSON.stringify(performance.getEntriesByName('first-paint'))
        });
    }

    firstPaint = JSON.parse(firstPaint);


    const firstContentfulPaint = JSON.parse(
        await page.evaluate(() =>
          JSON.stringify(performance.getEntriesByName('first-contentful-paint'))
        )
    );

    while(firstMean === 0){
        performanceMetrics = await client.send('Performance.getMetrics');        
        await page.waitFor(200);
        await page.screenshot({path: './screenshots/meaninigful-paint.png'});                    
        firstMean = getTime('FirstMeaningfulPaint');    
    }

    function getTime(name){
        return performanceMetrics.metrics.find(el => el.name === name).value;
    }

    function getRelTime(el){
        return  getTime(el) - getTime('NavigationStart');
    }




    var firstMeaningfulPaint = getRelTime('FirstMeaningfulPaint');

    const largestContentful = audits['largest-contentful-paint']['displayValue'];
    const speedIndex = audits['speed-index']['displayValue'];
    const blockingTime = audits['total-blocking-time']['displayValue'];
    const firstCpuIdle = audits['first-cpu-idle']['displayValue'];
    const interactive = audits['interactive']['displayValue'];
    
    console.log("Largest Contentful Paint"+" : "+largestContentful +"sec");
    console.log("Speed Index"+" : "+speedIndex +"sec");
    console.log("Total Blocking Time"+" : "+ blockingTime+"sec");
    console.log("First CPU Idle"+" : "+firstCpuIdle +"sec");
    console.log("Time to Interactive"+" : "+ interactive+"sec");
    
    console.log("firstPaint"+" : "+firstPaint[0].startTime/1000+ "sec");
    console.log("firstContentfulPaint"+" : "+firstContentfulPaint[0].startTime/1000+ "sec");
    console.log("firstMeaningfulPaint"+" : "+firstMeaningfulPaint + "sec");

    

    await browser.close();
})();