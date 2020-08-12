const puppeteer = require('puppeteer');

(async () => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    const client = await page.target().createCDPSession();
    await client.send('Performance.enable');

    await page.goto('https://web.dev/first-meaningful-paint/');

    


    var firstMean = 0;
    var performanceMetrics;

    const firstPaint = JSON.parse(
        await page.evaluate(() =>
        JSON.stringify(performance.getEntriesByName('first-paint'))
        )
    );

    const firstContentfulPaint = JSON.parse(
        await page.evaluate(() =>
          JSON.stringify(performance.getEntriesByName('first-contentful-paint'))
        )
    );

    // async function pageEvaluationTime(el){
    //     return promise = new Promise(async (res,rej)=>{
    //         try{
    //             var t =await JSON.parse(
    //                         page.evaluate(async () =>
    //                         await JSON.stringify(performance.getEntriesByName('first-paint'))
    //                     )
    //                 )
    //             console.log("t : "+t);
    //             res(t);
    //         }catch(err){
    //             rej(err);
    //         }
    //     })   
    // }
    // console.log(pageEvaluationTime('first-paint'));
    // var res = pageEvaluationTime('first-paint');
    // res.then((result)=>{
    //     console.log(result);
    // }).catch((e)=>{
    //     console.log("e : " + e);
    // });

    while(firstMean === 0){
        performanceMetrics = await client.send('Performance.getMetrics');        
        await page.waitFor(200);
        firstMean = getTime('FirstMeaningfulPaint');    
    }

    function getTime(name){
        return performanceMetrics.metrics.find(el => el.name === name).value;
    }

    function getRelTime(el){
        return  getTime(el) - getTime('NavigationStart');
    }




    var firstMeaningfulPaint = getRelTime('FirstMeaningfulPaint');


    console.log("firstPaint"+" : "+firstPaint[0].startTime/1000+ "sec");
    console.log("firstContentfulPaint"+" : "+firstContentfulPaint[0].startTime/1000+ "sec");
    console.log("firstMeaningfulPaint"+" : "+firstMeaningfulPaint + "sec");

    

    await browser.close();
})();