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

exports.FPpromise = (page) => {
    return new Promise(async function (resolve, reject) {
        try {
            var res = await calcPaint(page);
            res = res[0].startTime / 1000;
            console.log("FP : " + res);

            resolve(res);
        } catch (err) {
            reject(err);
        }
    })
}