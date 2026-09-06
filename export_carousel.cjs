const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
  const outputDir = path.join(__dirname, 'public', 'carousel_images');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Launching Chrome to capture slides...');
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1200, deviceScaleFactor: 2 });
  
  await page.goto('http://localhost:3333/clinaza_social_carousel.html', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  for (let i = 1; i <= 6; i++) {
    const selector = `#slide-${i}`;
    const slide = await page.$(selector);
    if (slide) {
      const outputPath = path.join(outputDir, `slide_0${i}.png`);
      await slide.screenshot({ path: outputPath });
      console.log(`Generated: slide_0${i}.png`);
    } else {
      console.log(`Selector not found: ${selector}`);
    }
  }

  await browser.close();
  console.log('Done! All slides saved to public/carousel_images/');
})();
