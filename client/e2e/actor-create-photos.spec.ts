import { test, expect } from '@playwright/test';

const sharp = require('../../server/node_modules/sharp');

for (const width of [1440, 390]) {
    test(`remove selected actor photos before creation ${width}`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width, height: 1000 });
        const buffer: Buffer = await sharp({ create: { width: 80, height: 100, channels: 3, background: '#268478' } }).jpeg().toBuffer();
        const files = ['portrait-1.jpg', 'portrait-2.jpg', 'portrait-3.jpg'].map(name => ({ name, mimeType: 'image/jpeg', buffer }));
        let submitted: string[] | undefined;
        await page.route('**/api/**', async route => {
            const pathname = new URL(route.request().url()).pathname;
            if (pathname === '/api/auth') return route.fulfill({ json: { accessToken: 'test', user: { id: 'admin', name: 'Admin', email: 'admin@example.org', isAdmin: true } } });
            if (pathname === '/api/employee') return route.fulfill({ json: [{ id: 'agent', firstName: 'Agent', lastName: 'Test' }] });
            if (pathname === '/api/actor/create') {
                const data = await new Request('http://localhost/create', { method: 'POST',
                    headers: { 'Content-Type': route.request().headers()['content-type'] }, body: route.request().postDataBuffer()! }).formData();
                submitted = data.getAll('photos').map(file => (file as File).name);
                return route.fulfill({ status: 400, json: { message: 'Test submission received' } });
            }
            return route.fulfill({ json: [] });
        });
        await page.goto('/actor_admin_panel');
        const picker = page.locator('#photos');
        const previews = page.getByRole('list', { name: 'Выбранные фотографии' });
        await picker.setInputFiles(files[2]);
        await picker.setInputFiles([files[0], files[1]]);
        await expect(previews.getByRole('img')).toHaveCount(3);
        await expect.poll(() => previews.getByRole('img').evaluateAll(images => images.map(image => image.getAttribute('alt'))))
            .toEqual(['portrait-3.jpg', 'portrait-1.jpg', 'portrait-2.jpg']);
        await page.getByRole('button', { name: 'Удалить фото portrait-2.jpg', exact: true }).click();
        await expect(previews.getByRole('img')).toHaveCount(2);
        await expect(previews.getByAltText('portrait-2.jpg')).toHaveCount(0);
        await expect(page.getByRole('status')).toHaveText('Выбрано фото: 2 / 20');
        await page.getByRole('button', { name: 'Переместить раньше portrait-1.jpg', exact: true }).click();
        await expect.poll(() => previews.getByRole('img').evaluateAll(images => images.map(image => image.getAttribute('alt'))))
            .toEqual(['portrait-1.jpg', 'portrait-3.jpg']);
        await expect(page.getByRole('button', { name: 'Переместить раньше portrait-1.jpg', exact: true })).toBeDisabled();
        await expect(page.getByRole('button', { name: 'Переместить позже portrait-3.jpg', exact: true })).toBeDisabled();
        await picker.setInputFiles(Array.from({ length: 19 }, (_, index) => ({ ...files[0], name: `extra-${index}.jpg` })));
        await expect(previews.getByRole('img')).toHaveCount(2);
        for (const image of await previews.getByRole('img').all()) {
            await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
        }
        const box = await previews.boundingBox();
        expect(box!.x + box!.width).toBeLessThanOrEqual(width);
        await page.locator('.actor-selected-photos').screenshot({ path: testInfo.outputPath('selected-photos.png') });
        await page.locator('input[type=file]').first().setInputFiles(files[0]);
        await page.getByRole('button', { name: 'Обрезать', exact: true }).click();
        await page.locator('#lastName').fill('Test');
        await page.locator('#firstName').fill('Actor');
        await page.getByRole('button', { name: 'Мужской', exact: true }).click();
        await page.locator('#height').fill('180');
        await page.locator('#employee-agent').check();
        await page.getByPlaceholder('Введите цвет глаз...').fill('Blue');
        await page.getByPlaceholder('Введите цвет волос...').fill('Black');
        await page.getByPlaceholder('Введите город...').fill('Moscow');
        await page.getByRole('button', { name: 'Создать актёра', exact: true }).click();
        await expect.poll(() => submitted).toEqual(['portrait-1.jpg', 'portrait-3.jpg']);
        await expect(page.getByText('Test submission received')).toBeVisible();
        await page.getByRole('button', { name: 'Удалить фото portrait-1.jpg', exact: true }).click();
        await page.getByRole('button', { name: 'Удалить фото portrait-3.jpg', exact: true }).click();
        await expect(previews).toHaveCount(0);
        submitted = undefined;
        await page.getByRole('button', { name: 'Создать актёра', exact: true }).click();
        await expect(page.getByText('Поле "Фотографии" не должно быть пустым')).toBeVisible();
        expect(submitted).toBeUndefined();
        await picker.setInputFiles(files[0]);
        await expect(previews.getByAltText('portrait-1.jpg')).toBeVisible();
    });
}
