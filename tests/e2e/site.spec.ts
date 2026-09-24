import { expect, test, type Page } from '@playwright/test';

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  return errors;
}

test('home page renders every section without errors', async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto('/');
  await expect(page).toHaveTitle(/Daniel Ajayi Lotsu/);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Daniel');
  for (const name of ['Things I’ve built', 'Meet Daniel', 'Tools I use', 'Career', 'Blog']) {
    await expect(page.getByRole('heading', { level: 2, name })).toBeVisible();
  }
  expect(await page.locator('script[type="application/ld+json"]').textContent()).toContain(
    '"Person"',
  );
  await expect(page.getByRole('link', { name: 'danielajayi100@gmail.com' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('career timeline is keyboard operable', async ({ page }) => {
  await page.goto('/#career');
  const second = page.getByRole('button', { name: /Backend Developer/ });
  await expect(second).toHaveAttribute('aria-expanded', 'false');
  await second.focus();
  await page.keyboard.press('Enter');
  await expect(second).toHaveAttribute('aria-expanded', 'true');
});

test('a blog post has its own page with metadata', async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto('/blog/designing-a-leave-management-api-that-scales-quietly');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Designing a leave-management API that scales quietly',
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    /\/blog\/designing-a-leave-management-api-that-scales-quietly$/,
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
  expect(await page.locator('script[type="application/ld+json"]').textContent()).toContain(
    'BlogPosting',
  );
  await expect(page.getByText('02 / 04')).toBeVisible();
  expect(errors).toEqual([]);
});

test('posts open over the home page and Escape closes them', async ({ page }) => {
  await page.goto('/');
  // Soft navigation (and so the dialog) needs the page to be hydrated.
  await page.waitForLoadState('networkidle');
  await page
    .locator('#blog')
    .getByRole('link', { name: /Cold starts/ })
    .click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(page).toHaveURL(/\/blog\/cold-starts/);
  await dialog.getByRole('link', { name: /Next/ }).click();
  await expect(page).toHaveURL(/\/blog\/designing-a-leave/);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page).toHaveURL(/\/$/);
});

test('the resume opens as a dialog and as a page', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page
    .getByRole('navigation', { name: 'Main' })
    .getByRole('link', { name: 'Resume' })
    .click();
  await expect(page.getByRole('dialog', { name: 'Daniel Ajayi Lotsu' })).toBeVisible();
  await page.goto('/resume');
  await expect(page.getByRole('heading', { level: 1, name: 'Daniel Ajayi Lotsu' })).toBeVisible();
});

test('the contact form validates and then sends', async ({ page }) => {
  await page.goto('/#contact');
  await page.getByPlaceholder('Your name').fill('Playwright Tester');
  await page.getByPlaceholder('Email address').fill('not-an-email');
  await page.getByPlaceholder('Message').fill('Hello from the smoke tests.');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.locator('#contact-email-err')).toBeVisible();
  await expect(page.getByPlaceholder('Your name')).toHaveValue('Playwright Tester');
  await page.getByPlaceholder('Email address').fill('tester@example.com');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByRole('heading', { name: 'Thanks, Playwright!' })).toBeVisible();
});

test('robots, sitemap and 404 are in place', async ({ page, request }) => {
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toMatch(/Disallow: \/cms/);
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap).toContain('/blog/cold-starts');
  const res = await page.goto('/no-such-page');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: /drifted out of orbit/ })).toBeVisible();
});
