import { chromium } from '@playwright/test';
const browser = await chromium.launch({ channel: 'chrome' });
const probe = async (url, w) => {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  await page.goto(url);
  await page.waitForTimeout(3500);
  const r = await page.evaluate(() => {
    const secs = [...document.querySelectorAll('main section, footer')].filter(
      (e) => !e.closest('footer') || e.tagName === 'FOOTER',
    );
    return {
      h: document.documentElement.scrollHeight,
      overflowX: document.documentElement.scrollWidth > innerWidth,
      secs: secs
        .map((e) => {
          const b = e.getBoundingClientRect();
          return `${Math.round(b.top + scrollY)}/${Math.round(b.height)}`;
        })
        .join(' '),
    };
  });
  await page.close();
  return r;
};
for (const w of [768, 375]) {
  const d = await probe('http://localhost:3108/Daniel%20Portfolio.dc.html', w);
  const o = await probe('http://localhost:3107/', w);
  console.log(`--- ${w}px  height design=${d.h} ours=${o.h}  overflowX ours=${o.overflowX}`);
  console.log(' design', d.secs);
  console.log(' ours  ', o.secs);
}
await browser.close();
