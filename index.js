const puppeteer = require('puppeteer');

(async () => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    const client = await page.target().createCDPSession();
    await client.send('Performance.enable');

    await page.goto('https://web.dev/first-meaningful-paint/');

    await page.waitFor(2000);

    const performanceMetrics = await client.send('Performance.getMetrics');

    function getTime(name){
        return performanceMetrics.metrics.find(el => el.name === name).value;
    }

    function getRelTime(el){
        return  getTime(el) - getTime('NavigationStart');
    }

    var firstMeaningfulPaint = getRelTime('FirstMeaningfulPaint');

    

    console.log("firstMeaningfulPaint"+" : "+firstMeaningfulPaint + "sec");

    await browser.close();
})();