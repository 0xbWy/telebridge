const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const EVIDENCE_DIR = '/root/.factory/missions/8947cf32-1f49-4d93-8819-31d74862aa1e/evidence/enc-ui/group2-menu-options';
fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto('http://localhost:1235', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(EVIDENCE_DIR, '04-dom-loaded.png'), fullPage: false });

  const bodyText = await page.textContent('body');
  console.log('BODY_LENGTH', bodyText.length);
  console.log('BODY_PREVIEW', bodyText.slice(0, 800));

  // Try clicking any chat in left pane if present
  const items = await page.$$('[class*="chat-list"] > div, [class*="Chat"]');
  console.log('CHAT_ITEMS', items.length);
  if (items.length > 0) {
    await items[0].click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '05-chat-open.png'), fullPage: false });
  }

  // Try to find TelebridgeLock component in DOM
  const lockBtn = await page.$('[data-encryption-status]');
  console.log('LOCK_BTN', lockBtn ? 'found' : 'not found');
  if (lockBtn) {
    const status = await lockBtn.getAttribute('data-encryption-status');
    console.log('LOCK_STATUS', status);
    await lockBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, '06-menu-open.png'), fullPage: false });
  }

  await browser.close();
})();
