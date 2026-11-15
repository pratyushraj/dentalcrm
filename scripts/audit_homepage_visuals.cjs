const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = '/Users/pratyushraj/.gemini/antigravity/brain/3eba0a15-e044-4121-8ed8-62cea45025d2';

async function audit() {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // 1. Audit Desktop (1440x900)
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  console.log('Navigating to http://localhost:8080 ...');
  await page.goto('http://localhost:8080', { waitUntil: 'networkidle0', timeout: 30000 });

  await new Promise(r => setTimeout(r, 1000));

  // Desktop Hero
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'audit_desktop_hero_fresh.png'),
    clip: { x: 0, y: 0, width: 1440, height: 900 }
  });
  console.log('Saved audit_desktop_hero_fresh.png');

  // Desktop Full Page
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'audit_desktop_full_fresh.png'),
    fullPage: true
  });
  console.log('Saved audit_desktop_full_fresh.png');

  // Extract Section & Structural Analysis
  const desktopAnalysis = await page.evaluate(() => {
    const h1s = Array.from(document.querySelectorAll('h1')).map(el => ({
      text: el.innerText.trim(),
      fontSize: window.getComputedStyle(el).fontSize,
      fontWeight: window.getComputedStyle(el).fontWeight,
      lineHeight: window.getComputedStyle(el).lineHeight,
      letterSpacing: window.getComputedStyle(el).letterSpacing
    }));
    const h2s = Array.from(document.querySelectorAll('h2')).map(el => ({
      text: el.innerText.trim(),
      fontSize: window.getComputedStyle(el).fontSize,
      fontWeight: window.getComputedStyle(el).fontWeight
    }));
    const buttons = Array.from(document.querySelectorAll('button, a[href]')).filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    }).map(el => ({
      text: el.innerText.trim().slice(0, 40),
      tag: el.tagName,
      width: Math.round(el.getBoundingClientRect().width),
      height: Math.round(el.getBoundingClientRect().height),
      bg: window.getComputedStyle(el).backgroundColor,
      color: window.getComputedStyle(el).color
    }));

    // Check animations present in CSS / DOM
    const animatedElements = Array.from(document.querySelectorAll('*')).filter(el => {
      const style = window.getComputedStyle(el);
      return style.animationName !== 'none' || (style.transitionProperty !== 'none' && style.transitionProperty !== 'all' && style.transitionDuration !== '0s');
    }).map(el => ({
      tag: el.tagName,
      className: (el.className && typeof el.className === 'string') ? el.className.slice(0, 50) : '',
      animation: window.getComputedStyle(el).animationName
    })).filter(x => x.animation !== 'none').slice(0, 15);

    return {
      title: document.title,
      h1s,
      h2Count: h2s.length,
      sampleH2s: h2s.slice(0, 6),
      buttonCount: buttons.length,
      sampleButtons: buttons.filter(b => b.text && b.height >= 38).slice(0, 8),
      bodyFont: window.getComputedStyle(document.body).fontFamily,
      animatedElementsCount: animatedElements.length,
      sampleAnimated: animatedElements
    };
  });

  // 2. Audit Mobile (390x844 - iPhone 14)
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  // Mobile Hero
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'audit_mobile_hero_fresh.png'),
    clip: { x: 0, y: 0, width: 390, height: 844 }
  });
  console.log('Saved audit_mobile_hero_fresh.png');

  // Mobile Full Page
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'audit_mobile_full_fresh.png'),
    fullPage: true
  });
  console.log('Saved audit_mobile_full_fresh.png');

  await browser.close();

  fs.writeFileSync(
    path.join(ARTIFACT_DIR, 'audit_homepage_analysis.json'),
    JSON.stringify(desktopAnalysis, null, 2)
  );
  console.log('Saved audit_homepage_analysis.json');
}

audit().catch(console.error);
