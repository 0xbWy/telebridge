const { chromium } = require('playwright');
const fs = require('fs');

const evidenceDir = '/root/.factory/missions/8947cf32-1f49-4d93-8819-31d74862aa1e/evidence/enc-ui/group1-icon-accessibility';
fs.mkdirSync(evidenceDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  try {
    await page.goto('http://localhost:1235', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(8000);
    await page.screenshot({ path: `${evidenceDir}/VAL-ENCUI-initial-load.png`, fullPage: true });
    console.log('Page loaded. URL:', page.url());
    console.log('Title:', await page.title());

    const bodyText = await page.textContent('body');
    console.log('Body length:', bodyText.length);

    const lockIcons = await page.locator('[data-encryption-status], .encryption-status, [aria-label*="encryption" i], [role="button"]').count();
    console.log('Potential encryption icon count:', lockIcons);

    const buttons = await page.locator('button, [role="button"], [tabindex], a').all();
    for (const btn of buttons.slice(0, 40)) {
      const tag = await btn.evaluate(el => el.tagName);
      const text = await btn.textContent().catch(() => '');
      const role = await btn.getAttribute('role');
      const tabIndex = await btn.getAttribute('tabindex');
      const cls = await btn.evaluate(el => el.className);
      const dataStatus = await btn.getAttribute('data-encryption-status');
      console.log(JSON.stringify({ tag, text: text.slice(0,60).replace(/\s+/g,' '), role, tabIndex, cls: cls.slice(0,60), dataStatus }));
    }
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await browser.close();
  }
})();
