import { test, expect } from '@playwright/test';
for (const width of [1440, 390]) {
    test(`admin actor ordering ${width}`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        const actors = Array.from({ length: 65 }, (_, i) => ({ id: String(i), firstName: 'Actor', lastName: `Name${i}`, directory: String(i) }));
        let ids = actors.map(actor => actor.id);
        await page.route('**/api/**', route => {
            const path = new URL(route.request().url()).pathname;
            if (path === '/api/auth') return route.fulfill({ json: { accessToken: 'test', user: { isAdmin: true, name: 'Admin' } } });
            if (path === '/api/actor/order') {
                const body = route.request().postDataJSON();
                expect(body.originalIds).toEqual(ids);
                expect(route.request().headers().authorization).toBe('Bearer test');
                ids = body.ids;
                return route.fulfill({ json: true });
            }
            return route.fulfill({ json: path === '/api/actor/get/men' ? ids.map(id => actors[Number(id)]) : [] });
        });
        await page.goto('/actors/men');
        await page.getByRole('button', { name: 'Изменить порядок' }).click();
        await page.getByLabel('Позиция: Name64 Actor', { exact: true }).selectOption('0');
        await expect(page.locator('.actor-order li').first()).toContainText('Name64 Actor');
        await page.getByRole('button', { name: 'Сохранить порядок' }).click();
        await expect(page.locator('.page_cards a').first()).toHaveAttribute('href', '/actors/64');
        await page.reload();
        await expect(page.locator('.page_cards a').first()).toHaveAttribute('href', '/actors/64');
        await page.getByRole('button', { name: 'Изменить порядок' }).click();
        await page.getByRole('button', { name: 'Ниже: Name64', exact: true }).click();
        await page.getByRole('button', { name: 'Отмена', exact: true }).click();
        await expect(page.locator('.page_cards a').first()).toHaveAttribute('href', '/actors/64');
    });
}
