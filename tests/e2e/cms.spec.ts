import { expect, test, type Page } from '@playwright/test';

const email = process.env.ADMIN_EMAIL ?? '';
const password = process.env.ADMIN_INITIAL_PASSWORD ?? '';

async function signIn(page: Page) {
  await page.goto('/cms');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Unlock' }).click();
  await expect(page.getByRole('navigation', { name: 'CMS sections' })).toBeVisible();
}

test.describe('CMS', () => {
  test.skip(!email || !password, 'ADMIN_EMAIL and ADMIN_INITIAL_PASSWORD are required');

  test('is private and not indexable', async ({ page }) => {
    const res = await page.goto('/cms/projects');
    await expect(page).toHaveURL(/\/cms\?next=/);
    expect(res?.headers()['x-robots-tag']).toContain('noindex');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    const api = await page.request.post('/api/cms/upload', { data: {} });
    expect(api.status()).toBe(401);
  });

  test('rejects a wrong password', async ({ page }) => {
    await page.goto('/cms');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill('definitely-not-it');
    await page.getByRole('button', { name: 'Unlock' }).click();
    await expect(page.locator('form').getByRole('alert')).toContainText('don’t match');
  });

  test('sign in, edit, publish, and the live site updates', async ({ page, request }) => {
    const marker = `Smoke test ${Date.now()}`;
    await signIn(page);

    const tagline = page.getByLabel('Tagline');
    const original = await tagline.inputValue();
    await tagline.fill(marker);
    await expect(page.getByRole('status').filter({ hasText: 'Draft saved' })).toBeVisible();

    // Drafts never leak to the live site.
    expect(await (await request.get('/')).text()).not.toContain(marker);

    // The preview shows the draft straight away.
    const preview = page.frameLocator('iframe[title^="Preview"]');
    await expect(preview.getByText(marker)).toBeVisible();

    await page.getByRole('button', { name: /^Publish \(\d+\)$/ }).click();
    await expect(page.getByRole('button', { name: 'Published' })).toBeVisible();
    await expect.poll(async () => (await request.get('/')).text()).toContain(marker);

    // Put it back so the test leaves the site as it found it.
    await tagline.fill(original);
    await expect(page.getByRole('status').filter({ hasText: 'Draft saved' })).toBeVisible();
    await page.getByRole('button', { name: /^Publish \(\d+\)$/ }).click();
    await expect(page.getByRole('button', { name: 'Published' })).toBeVisible();
    await expect.poll(async () => (await request.get('/')).text()).not.toContain(marker);
  });
});
