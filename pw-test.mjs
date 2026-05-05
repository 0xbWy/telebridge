import { chromium } from 'playwright';
import fs from 'fs';

const evidence = '/root/.factory/missions/8947cf32-1f49-4d93-8819-31d74862aa1e/evidence/enc-ui/group1-icon-accessibility';
fs.mkdirSync(evidence, { recursive: true });

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
try {
  await page.goto('http://localhost:1235', { waitUntil: 'commit', timeout: 20000 });
  await page.waitForTimeout(8000);
  await page.screenshot({ path: evidence+'/VAL-ENCUI-initial-load.png', fullPage: true });
  console.log('title:', await page.title());
  const html = await page.content();
  fs.writeFileSync(evidence+'/page-html.html', html);
  const lock = await page.locator('[data-encryption-status]').first();
  console.log('lock count:', await page.locator('[data-encryption-status]').count());
  if (await lock.count()) {
    console.log('lock role:', await lock.getAttribute('role'));
    console.log('lock tabindex:', await lock.getAttribute('tabindex'));
    console.log('lock class:', await lock.evaluate(e=>e.className));
  }
} catch(e){ console.error('ERR',e); }
await browser.close();
