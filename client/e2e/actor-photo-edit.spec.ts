import { test, expect } from '@playwright/test';
const sharp = require('../../server/node_modules/sharp');

for (const width of [1440, 390]) {
    test(`actor gallery reorder and delete ${width}`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width, height: 1000 });
        let photos = ['one', 'two', 'three'];
        let fail = false;
        const image = await sharp({ create: { width: 80, height: 100, channels: 3, background: '#268478' } }).jpeg().toBuffer();
        const actor = () => ({ id: 'test', firstName: 'Test', lastName: 'Actor', dateOfBirth: '1990-01-01', gender: 'M',
            directory: 'test', employee: { id: 'agent', firstName: 'Agent', lastName: 'Test' }, height: 180,
            city: { name: 'Moscow' }, eyeColor: { name: 'Blue' }, hairColor: { name: 'Black' }, photos, skills: [], languages: [], videos: [] });
        await page.route('**/uploads/**', route => route.fulfill({ contentType: 'image/jpeg', body: image }));
        await page.route('**/api/**', route => {
            const path = new URL(route.request().url()).pathname;
            if (path === '/api/auth') return route.fulfill({ json: { accessToken: 'test', user: { id: 1, isAdmin: true, name: 'Admin', email: 'test@example.org' } } });
            if (path === '/api/actor/test') return route.fulfill({ json: actor() });
            if (path === '/api/actor-video/config') return route.fulfill({ json: { maxBytes: 2147483648 } });
            if (path.startsWith('/api/actor/edit/')) {
                expect(route.request().headers().authorization).toBe('Bearer test');
                if (fail) return route.fulfill({ status: 500, json: { message: 'Сохранение не удалось' } });
                if (path.endsWith('changeOrderAlbum')) photos = route.request().postDataJSON().photos;
                if (path.endsWith('deleteFromAlbum')) photos = photos.filter(photo => photo !== route.request().postDataJSON().photoId);
                if (path.endsWith('addToAlbum')) { photos.push('four'); return route.fulfill({ json: actor() }); }
                return route.fulfill({ json: true });
            }
            return route.fulfill({ json: [] });
        });
        await page.goto('/actors/test');
        await page.getByRole('button', { name: 'Редактировать фото', exact: true }).click();
        const editor = page.getByRole('region', { name: 'Редактирование фотогалереи' });
        const order = () => editor.locator('[data-photo-id]').evaluateAll(items => items.map(item => item.getAttribute('data-photo-id')));
        await page.getByRole('button', { name: 'Переместить фото 2 раньше', exact: true }).click();
        await expect.poll(order).toEqual(['two', 'one', 'three']);
        fail = true;
        await page.getByRole('button', { name: 'Переместить фото 2 раньше', exact: true }).click();
        await expect(editor.getByRole('alert')).toHaveText('Сохранение не удалось');
        await expect.poll(order).toEqual(['two', 'one', 'three']);
        fail = false;
        const handle = page.getByRole('button', { name: 'Перетащить фото 1', exact: true });
        await expect(handle).toBeEnabled();
        await handle.scrollIntoViewIfNeeded();
        await handle.focus();
        await page.keyboard.press('Space');
        await expect(handle).toHaveAttribute('aria-pressed', 'true');
        await expect(page.getByRole('status').filter({ hasText: 'over droppable area two' })).toHaveCount(1);
        await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
        await page.keyboard.press('ArrowRight');
        await expect(page.getByRole('status').filter({ hasText: 'over droppable area one' })).toHaveCount(1);
        await page.keyboard.press('Space');
        await expect.poll(order).toEqual(['one', 'two', 'three']);
        page.once('dialog', dialog => dialog.dismiss());
        await page.getByRole('button', { name: 'Удалить фото 2', exact: true }).click();
        await expect.poll(order).toEqual(['one', 'two', 'three']);
        page.once('dialog', dialog => dialog.accept());
        await page.getByRole('button', { name: 'Удалить фото 2', exact: true }).click();
        await expect.poll(order).toEqual(['one', 'three']);
        await page.getByLabel('Добавить фотографии', { exact: true }).setInputFiles({ name: 'four.jpg', mimeType: 'image/jpeg', buffer: image });
        await expect.poll(order).toEqual(['one', 'three', 'four']);
        await expect(editor.locator('.actor-photo-status')).toHaveText('Сохранено');
        const box = await editor.boundingBox(); expect(box!.x + box!.width).toBeLessThanOrEqual(width);
        await editor.screenshot({ path: testInfo.outputPath('gallery.png') });
        await page.reload();
        await page.getByRole('button', { name: 'Редактировать', exact: true }).click();
        await expect(editor).toBeVisible();
        await expect.poll(order).toEqual(['one', 'three', 'four']);
    });
}
