import { test, expect } from '@playwright/test';

const sharp = require('../../server/node_modules/sharp');
const agentId = '6e9bc6da-425f-4c92-8f19-3fc95a695f0c';
const initial = {
    id: agentId, firstName: 'Мария', lastName: 'Иванова', middleName: 'Сергеевна', email: 'agent@example.org',
    phone: '+79990000000', photo: 'old-avatar', description: 'Описание агента', telegram: 'agent',
    vk: 'https://vk.com/agent', instagram: '', facebook: '',
};

for (const width of [1440, 390]) {
    test(`agent edit, cancel, error, avatar ${width}`, async ({ page }, testInfo) => {
        await page.setViewportSize({ width, height: 1000 });
        const image: Buffer = await sharp({ create: { width: 80, height: 100, channels: 3, background: '#268478' } }).png().toBuffer();
        let employee = { ...initial };
        let fail = false;
        let writes = 0;
        let saved: FormData | undefined;
        await page.route('**/uploads/**', route => route.fulfill({ contentType: 'image/png', body: image }));
        await page.route('**/api/**', async route => {
            const url = new URL(route.request().url()).pathname;
            if (url === '/api/auth') return route.fulfill({ json: { accessToken: 'test', user: { id: 'admin', name: 'Admin', email: 'admin@example.org', isAdmin: true } } });
            if (url === '/api/employee/edit') {
                writes++;
                expect(route.request().headers().authorization).toBe('Bearer test');
                if (fail) return route.fulfill({ status: 409, json: { message: 'Агент с таким email или телефоном уже существует' } });
                const request = new Request('http://localhost/edit', { method: 'POST',
                    headers: { 'Content-Type': route.request().headers()['content-type'] }, body: route.request().postDataBuffer()! });
                saved = await request.formData();
                for (const [key, value] of saved.entries()) {
                    if (typeof value === 'string' && key in employee) (employee as Record<string, string>)[key] = value;
                }
                if (saved.has('newAvatar')) employee.photo = 'new-avatar';
                return route.fulfill({ json: employee });
            }
            if (url === `/api/employee/${agentId}`) return route.fulfill({ json: employee });
            return route.fulfill({ json: [] });
        });
        await page.goto(`/employees/${agentId}`);
        await page.getByRole('button', { name: 'Редактировать агента' }).click();
        await expect(page.getByLabel('Имя *', { exact: true })).toHaveValue('Мария');
        await expect(page.getByRole('button', { name: 'Сохранить', exact: true })).toBeDisabled();
        await page.getByLabel('Имя *', { exact: true }).fill('Отменить');
        page.once('dialog', dialog => dialog.accept());
        await page.getByRole('button', { name: 'Отмена', exact: true }).click();
        expect(writes).toBe(0);
        await page.getByRole('button', { name: 'Редактировать агента' }).click();
        await expect(page.getByLabel('Имя *', { exact: true })).toHaveValue('Мария');
        await page.getByLabel('Имя *', { exact: true }).fill('Анна');
        await page.getByLabel('Отчество', { exact: true }).fill('');
        await page.getByLabel('ВКонтакте', { exact: true }).fill('');
        await page.getByLabel('Описание', { exact: true }).fill('Обновлённое описание');
        fail = true;
        await page.getByRole('button', { name: 'Сохранить', exact: true }).click();
        await expect(page.getByRole('alert')).toContainText('уже существует');
        await expect(page.getByLabel('Имя *', { exact: true })).toHaveValue('Анна');
        fail = false;
        await page.getByLabel('Фото агента', { exact: true }).setInputFiles({ name: 'avatar.png', mimeType: 'image/png', buffer: image });
        await page.getByRole('button', { name: 'Обрезать', exact: true }).click();
        await expect(page.getByAltText('Новое фото агента')).toBeVisible();
        const form = page.getByRole('form', { name: 'Редактирование агента' });
        const box = await form.boundingBox();
        expect(box!.x + box!.width).toBeLessThanOrEqual(width);
        await form.screenshot({ path: testInfo.outputPath('agent-edit.png') });
        await page.getByRole('button', { name: 'Сохранить', exact: true }).click();
        await expect(form).toHaveCount(0);
        expect(saved!.get('middleName')).toBe('');
        expect(saved!.get('vk')).toBe('');
        expect(saved!.has('newAvatar')).toBe(true);
        await expect(page.locator('.person_fio')).toContainText('Иванова Анна');
        await expect(page.locator('.person_avatar')).toHaveAttribute('src', '/uploads/new-avatar_400.jpg');
        await expect(page.locator('.description')).toHaveText('Обновлённое описание');
        await page.reload();
        await expect(page.locator('.person_fio')).toContainText('Иванова Анна');
    });
}

test('agent editor is not shown to visitors', async ({ page }) => {
    await page.route('**/api/**', route => {
        const url = new URL(route.request().url()).pathname;
        if (url === '/api/auth') return route.fulfill({ status: 401, json: { message: 'Unauthorized' } });
        return route.fulfill({ json: url === `/api/employee/${agentId}` ? initial : [] });
    });
    await page.goto(`/employees/${agentId}`);
    await expect(page.locator('.person_fio')).toContainText('Иванова Мария');
    await expect(page.getByRole('button', { name: 'Редактировать агента' })).toHaveCount(0);
});
