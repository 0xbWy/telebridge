const { chromium } = require('playwright');
const fs = require('fs');

const evidence = '/root/.factory/missions/8947cf32-1f49-4d93-8819-31d74862aa1e/evidence/enc-ui/group1-icon-accessibility';
fs.mkdirSync(evidence, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on('console', msg => console.log('console:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('pageerror:', err.message));
  try {
    await page.goto('http://localhost:1235', { waitUntil: 'commit', timeout: 20000 });
    await page.waitForTimeout(10000);
    await page.screenshot({ path: evidence+'/VAL-ENCUI-initial-load.png', fullPage: true });
    console.log('title:', await page.title());
    const els = await page.locator('button,[role=button],[tabindex],a').all();
    console.log('elements:', els.length);
    for (const el of els.slice(0,40)) {
      const tag = await el.evaluate(e=> e.tagName);
      const text = (await el.textContent().catch(()=>'')).slice(0,40).replace(/\s+/g,' ');
      const role = await el.getAttribute('role');
      const tabindex = await el.getAttribute('tabindex');
      const cls = (await el.evaluate(e=> e.className)||'').slice(0,40);
      const ds = await el.getAttribute('data-encryption-status');
      console.log(JSON.stringify({tag,text,role,tabindex,cls,ds}));
    }
  } catch(e){ console.error('ERR',e); }
  await browser.close();
})();
