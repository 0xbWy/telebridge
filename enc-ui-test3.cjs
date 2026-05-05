const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const EVIDENCE_DIR = '/root/.factory/missions/8947cf32-1f49-4d93-8819-31d74862aa1e/evidence/enc-ui/group2-menu-options';
fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true, args: [
    '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
    '--disable-gpu', '--disable-software-rasterizer'
  ]});
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('http://localhost:1235', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, '07-app-loaded.png'), fullPage: false });

  const bodyText = await page.textContent('body');
  console.log('BODY_PREVIEW:', bodyText.slice(0, 600));

  // Try clicking first child of left column
  const leftItems = await page.$$('[class*="left"] [role="button"], [class*="Left"] [role="button"], .chat-list-wrapper [role="button"]');
  console.log('LEFT_ITEMS:', leftItems.length);
  if (leftItems.length > 0) {
    await leftItems[0].click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '08-after-click.png'), fullPage: false });
  }

  const lockBtn = await page.$('[data-encryption-status]');
  console.log('LOCK_BTN:', lockBtn ? 'found' : 'not found');
  if (lockBtn) {
    const status = await lockBtn.getAttribute('data-encryption-status');
    console.log('LOCK_STATUS:', status);
    await lockBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '09-menu-open.png'), fullPage: false });
  }

  await browser.close();
})().catch(err => { console.error(err); process.exit(1); });
