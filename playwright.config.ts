import { defineConfig, devices } from '@playwright/test';
import './scripts/load-env';

const port = Number(process.env.E2E_PORT ?? 3200);
/** Point at an already-running server (e.g. `pnpm dev`) to skip starting one. */
const external = process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: external ?? `http://localhost:${port}`,
    trace: 'retain-on-failure',
    // Locally, reuse an installed Chrome instead of downloading a browser.
    channel: process.env.CI ? undefined : (process.env.E2E_CHANNEL ?? 'chrome'),
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: external
    ? undefined
    : {
        // Expects `pnpm build` to have run (CI does this in an earlier step).
        command: `pnpm start --port ${port}`,
        url: `http://localhost:${port}`,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
