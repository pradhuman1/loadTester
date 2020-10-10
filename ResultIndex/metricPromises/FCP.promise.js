exports.FCPpromise = function (page) {
    return new Promise(async function (resolve, reject) {
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
}