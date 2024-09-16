const puppeteer = require('puppeteer');

(async () => {
    try {
        const browser = await puppeteer.launch({headless: false, executablePath:"C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe"});
        const page = await browser.newPage();
        await page.goto('https://www.google.com/search?q=puppeteer');
        const title = await page.title();
        console.log(title);
        // await browser.close();
    } catch (error) {
        console.log(error);
    }
})();