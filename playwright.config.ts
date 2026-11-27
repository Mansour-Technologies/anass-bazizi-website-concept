import { defineConfig, devices } from '@playwright/test';

const live = process.env.BASE_URL;
const baseURL = live ?? 'http://localhost:4410/anass-bazizi-website-concept/';
const exe = process.env.PW_CHROMIUM; // optional: reuse an installed Chromium build

export default defineConfig({
  testDir: 'tests',
  timeout: 45_000,
  fullyParallel: true,
  workers: 4,
  reporter: [['list']],
  use: { baseURL, trace: 'off', locale: 'fr-FR', launchOptions: exe ? { executablePath: exe } : {} },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], launchOptions: exe ? { executablePath: exe } : {} } }],
  webServer: live ? undefined : { command: 'node tools/serve.mjs', url: baseURL, reuseExistingServer: true, timeout: 20_000 },
});
