const puppeteer = require('puppeteer');
const path = require('path');

async function run() {
  console.log('[Puppeteer] Launching Chrome to complete Razorpay test payment automatically...');
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: false, // Visible so we can see the magic
    defaultViewport: { width: 1280, height: 800 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const fileUrl = 'file:///Users/pratyushraj/Desktop/test_razorpay_checkout.html';
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  console.log('[Puppeteer] Waiting for Razorpay Checkout iframe...');
  await page.waitForSelector('iframe.razorpay-checkout-frame', { timeout: 15000 });
  const iframeElement = await page.$('iframe.razorpay-checkout-frame');
  const frame = await iframeElement.contentFrame();

  console.log('[Puppeteer] Connected to Razorpay frame. Looking for payment options...');
  await frame.waitForTimeout(2000);

  // Look for Card or UPI or Netbanking option
  // In Razorpay v2 checkout, options are typically:
  // "Card", "UPI / QR", "Netbanking"
  const bodyText = await frame.evaluate(() => document.body.innerText);
  console.log('[Puppeteer] Frame content snippet:\n', bodyText.slice(0, 300));

  // Try to click Card or Test Card
  const clickedCard = await frame.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('button, div, a, span'));
    const cardEl = elements.find(el => el.innerText && el.innerText.includes('Card') && !el.innerText.includes('EMI'));
    if (cardEl) {
      cardEl.click();
      return true;
    }
    return false;
  });

  console.log('[Puppeteer] Clicked Card option:', clickedCard);
  await frame.waitForTimeout(2000);

  // Take screenshot of current state
  await page.screenshot({ path: '/tmp/razorpay_step1.png' });
  console.log('[Puppeteer] Screenshot saved to /tmp/razorpay_step1.png');

  // Let browser stay open for a bit so we can inspect
  await page.waitForTimeout(5000);
  await browser.close();
}

run().catch(err => {
  console.error('[Puppeteer] Error:', err);
  process.exit(1);
});
