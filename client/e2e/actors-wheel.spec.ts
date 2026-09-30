import { test, expect } from '@playwright/test';

for (const width of [1440, 390]) {
    test(`bounded actor wheel ${width}`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.route('**/api/**', route => route.fulfill({ json: new URL(route.request().url()).pathname === '/api/actor'
            ? Array.from({ length: 65 }, (_, id) => ({ id: String(id), firstName: 'Actor', lastName: String(id), directory: String(id) }))
            : [] }));
        await page.route('**/uploads/**', route => route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="260" height="360"><rect width="260" height="360" fill="#18776d"/></svg>' }));
        await page.goto('/about');
        const wheel = page.locator('.actors-wheel');
        await wheel.scrollIntoViewIfNeeded();
        await expect(wheel.locator('.swiper-slide')).toHaveCount(12);
        const links = await wheel.locator('a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')));
        expect(new Set(links).size).toBe(12);
        await expect.poll(() => wheel.locator('.swiper').evaluate((node: any) => node.swiper.autoplay.running)).toBe(true);
        await expect.poll(() => wheel.locator('.swiper').evaluate((node: any) => node.swiper.realIndex), { timeout: 7000 }).not.toBe(0);
        await page.screenshot({ path: `testing/wheel-${width}.png` });
        await page.evaluate(() => window.scrollTo(0, 0));
        await expect.poll(() => wheel.locator('.swiper').evaluate((node: any) => node.swiper.autoplay.running)).toBe(false);
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await wheel.scrollIntoViewIfNeeded();
        await expect.poll(() => wheel.locator('.swiper').evaluate((node: any) => node.swiper.autoplay.running)).toBe(false);
    });
}
