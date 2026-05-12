import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('BROWSER ERROR:', msg.text());
  });
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  try {
    await page.goto('http://localhost:5175', { waitUntil: 'networkidle' });
    console.log('Page loaded successfully without crashing.');
  } catch (e) {
    console.log('NAVIGATION ERROR:', e.message);
  }

  await browser.close();
})();
