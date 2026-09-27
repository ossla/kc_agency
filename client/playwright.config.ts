import { defineConfig } from '@playwright/test';
export default defineConfig({
    testDir: './e2e',
    outputDir: './testing/playwright',
    use: { baseURL: 'http://localhost:3000', browserName: 'chromium' },
    workers: 1,
    webServer: {
        command: 'npm run start',
        url: 'http://localhost:3000',
        timeout: 120000,
        reuseExistingServer: true,
        env: { BROWSER: 'none', PORT: '3000' },
    },
});
