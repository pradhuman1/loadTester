const { getLighthouseIndex } = require('../lightHouseIndex.js');

exports.LHpromise = (browser, page, url) => {
    return new Promise(async function (resolve, reject) {
        try {
            var res = await getLighthouseIndex(browser, page, url);
            console.log(res);
            resolve(res);
        } catch (err) {
            reject(err)
        }

    })
}