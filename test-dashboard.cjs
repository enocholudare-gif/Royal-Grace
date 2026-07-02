const puppeteer = require('puppeteer');

(async () => {
    try {
        console.log('Launching browser...');
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();

        page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
        page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
        page.on('response', response => {
            if (response.status() >= 400) {
                console.log('BROWSER NETWORK ERROR:', response.status(), response.url());
            }
        });

        console.log('Navigating to login page...');
        await page.goto('http://127.0.0.1:8000/login', { waitUntil: 'networkidle0' });
        
        console.log('Login page loaded. Checking for #app content...');
        const appHtml = await page.$eval('#app', el => el.innerHTML);
        console.log('#app length:', appHtml.length);
        if (appHtml.length < 50) {
            console.log('#app content:', appHtml);
        }

        console.log('Typing credentials...');
        await page.type('input[type="email"]', 'admin@example.com');
        await page.type('input[type="password"]', 'password');
        
        console.log('Clicking login...');
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('button[type="submit"]')
        ]);

        console.log('Redirected to:', page.url());
        
        console.log('Dashboard loaded. Checking for #app content...');
        const dashHtml = await page.$eval('#app', el => el.innerHTML);
        console.log('#app length:', dashHtml.length);
        if (dashHtml.length < 50) {
            console.log('#app content:', dashHtml);
        }
        
        await browser.close();
        console.log('Done.');
    } catch (e) {
        console.error('SCRIPT ERROR:', e);
    }
})();
