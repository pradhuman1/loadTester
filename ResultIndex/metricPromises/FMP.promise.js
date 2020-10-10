var firstMean = 0;
var performanceMetrics;

function getTime(name) {
    return performanceMetrics.metrics.find(el => el.name === name).value;
}

function getRelTime(el) {
    return getTime(el) - getTime('NavigationStart');
}

exports.FMPpromise = (page, client) => {
    return new Promise(async function (resolve, reject) {
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
}