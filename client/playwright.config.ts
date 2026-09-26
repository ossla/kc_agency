import { defineConfig } from '@playwright/test';
export default defineConfig({
    testDir: './e2e',
    outputDir: './testing/playwright',
    use: { baseURL: 'http://localhost:3000', browserName: 'chromium' },
    workers: 1,
});
