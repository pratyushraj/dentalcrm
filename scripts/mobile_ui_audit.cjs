const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = '/Users/pratyushraj/.gemini/antigravity/brain/3eba0a15-e044-4121-8ed8-62cea45025d2';

async function runMobileAudit() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const pagesToTest = [
    { name: 'homepage', url: 'http://localhost:8080/' },
    { name: 'onboarding', url: 'http://localhost:8080/clinic-onboarding' },
    { name: 'kyc', url: 'http://localhost:8080/clinic-kyc' }
  ];

  const auditReport = [];

  for (const item of pagesToTest) {
    console.log(`\n========================================`);
    console.log(`Auditing: ${item.name} (${item.url})`);
    console.log(`========================================`);

    const page = await browser.newPage();
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Mobile Viewport: iPhone 14/15/16 (390 x 844, dpr 3)
    await page.setViewport({
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true
    });

    await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    // Wait for hydration
    await new Promise(r => setTimeout(r, 2000));

    // 1. Check Horizontal Overflow
    const overflowInfo = await page.evaluate(() => {
      const docWidth = document.documentElement.scrollWidth;
      const winWidth = window.innerWidth;
      const isOverflowing = docWidth > winWidth;
      
      const overflowingElements = [];
      if (isOverflowing) {
        const all = document.querySelectorAll('*');
        for (const el of all) {
          const rect = el.getBoundingClientRect();
          if (rect.right > winWidth + 2) {
            overflowingElements.push({
              tag: el.tagName.toLowerCase(),
              className: el.className ? String(el.className).substring(0, 80) : '',
              id: el.id || '',
              right: Math.round(rect.right),
              width: Math.round(rect.width)
            });
          }
        }
      }
      return { docWidth, winWidth, isOverflowing, overflowingElements: overflowingElements.slice(0, 10) };
    });

    console.log(`Horizontal Overflow: ${overflowInfo.isOverflowing ? 'FAILED (width: ' + overflowInfo.docWidth + 'px vs win: ' + overflowInfo.winWidth + 'px)' : 'PASSED (0 overflow)'}`);
    if (overflowInfo.overflowingElements.length > 0) {
      console.log('Overflow causes:', overflowInfo.overflowingElements);
    }

    // 2. Check Input Font Sizes for iOS Safari Auto-Zoom bug (font-size < 16px)
    const inputFontIssues = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input, select, textarea');
      const issues = [];
      inputs.forEach(el => {
        const style = window.getComputedStyle(el);
        const fsize = parseFloat(style.fontSize);
        if (fsize < 16 && el.type !== 'checkbox' && el.type !== 'radio') {
          issues.push({
            tag: el.tagName.toLowerCase(),
            name: el.name || el.placeholder || el.id || 'unnamed',
            fontSize: style.fontSize
          });
        }
      });
      return issues;
    });

    console.log(`Inputs with <16px font (triggers iOS Safari zoom): ${inputFontIssues.length}`);
    if (inputFontIssues.length > 0) {
      console.log('Sample <16px inputs:', inputFontIssues.slice(0, 5));
    }

    // 3. Check Touch Target Sizes (< 44px height or width)
    const touchTargetIssues = await page.evaluate(() => {
      const clickables = document.querySelectorAll('button, a[href], input[type="submit"], [role="button"]');
      const smallTargets = [];
      clickables.forEach(el => {
        const rect = el.getBoundingClientRect();
        // check only visible elements
        if (rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight * 2) {
          if (rect.height < 40 || rect.width < 40) {
            smallTargets.push({
              text: (el.innerText || el.getAttribute('aria-label') || el.name || '').trim().substring(0, 30),
              width: Math.round(rect.width),
              height: Math.round(rect.height),
              tag: el.tagName.toLowerCase(),
              class: el.className ? String(el.className).substring(0, 50) : ''
            });
          }
        }
      });
      return smallTargets;
    });

    console.log(`Clickable elements <40px touch target: ${touchTargetIssues.length}`);
    if (touchTargetIssues.length > 0) {
      console.log('Sample small touch targets:', touchTargetIssues.slice(0, 5));
    }

    // 4. Capture Full Mobile Screenshot
    const screenshotPath = path.join(ARTIFACT_DIR, `mobile_audit_${item.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Captured mobile screenshot: ${screenshotPath}`);

    auditReport.push({
      page: item.name,
      url: item.url,
      screenshot: screenshotPath,
      overflow: overflowInfo,
      inputFontIssues,
      touchTargetIssues,
      consoleErrors
    });

    await page.close();
  }

  await browser.close();

  const reportPath = path.join(ARTIFACT_DIR, 'mobile_ui_audit_results.json');
  fs.writeFileSync(reportPath, JSON.stringify(auditReport, null, 2));
  console.log(`\nAudit complete! Saved detailed metrics to ${reportPath}`);
}

runMobileAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
