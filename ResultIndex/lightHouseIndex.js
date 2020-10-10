const lighthouse = require('lighthouse');

exports.getLighthouseIndex = async function (browser, page, url) {
    const lighthouseConfig = {
        port: (
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

    const { lhr: { audits } } = await lighthouse(
        url,
        lighthouseConfig,
        auditConfig
    )


    const largestContentful = audits['largest-contentful-paint']['displayValue'];
    const speedIndex = audits['speed-index']['displayValue'];
    const blockingTime = audits['total-blocking-time']['displayValue'];
    const firstCpuIdle = audits['first-cpu-idle']['displayValue'];
    const interactive = audits['interactive']['displayValue'];

    return {
        largestContentful,
        speedIndex,
        blockingTime,
        firstCpuIdle,
        interactive
    }

}
