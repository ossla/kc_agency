import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const fixture = path.resolve(__dirname, '../testing/fixture.mp4');
const src = '/uploads/test/video-test.mp4';
test.beforeAll(() => {
    fs.mkdirSync(path.dirname(fixture), { recursive: true });
    execFileSync(require('../../server/node_modules/ffmpeg-static'), ['-y', '-v', 'error', '-f', 'lavfi', '-i',
        'testsrc=size=640x360:rate=24', '-t', '4', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', fixture]);
});

for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    test(`multiple uploads, playback, seek, replace, delete ${viewport.width}`, async ({ page }, testInfo) => {
        await page.setViewportSize(viewport);
        const errors: string[] = [];
        page.on('pageerror', error => errors.push(error.message));
        let videos: { id: string; url: string; name: string }[] = [];
        let sequence = 0;
        let failUpload = false;
        await page.route('**/api/**', route => {
            const url = new URL(route.request().url()).pathname;
            let data: unknown = [];
            if (url === '/api/auth') data = { accessToken: 'test', user: { id: 1, name: 'Admin', email: 'test@example.org', isAdmin: true } };
            else if (url === '/api/actor-video/config') data = { maxBytes: 2147483648 };
            else if (url.startsWith('/api/actor-video/test')) {
                if (failUpload) return route.fulfill({ status: 500, json: { message: 'Test upload failure' } });
                const target = url.split('/')[4];
                let uploadedId: string | undefined;
                if (route.request().method() === 'DELETE') videos = videos.filter(video => video.id !== target);
                else {
                    uploadedId = target || String(++sequence);
                    const entry = { id: uploadedId, url: src + `?version=${++sequence}`, name: `Видео ${sequence}.mp4` };
                    if (target) videos = videos.map(video => video.id === target ? entry : video);
                    else videos.push(entry);
                }
                data = { videos, videoURL: videos[0]?.url || '', uploadedId };
            } else if (url === '/api/actor/test') data = {
                id: 'test', firstName: 'Test', lastName: 'Actor', gender: 'M', dateOfBirth: '1990-01-01',
                height: 180, directory: 'test', employee: { id: 'agent', firstName: 'Agent', lastName: 'Test' },
                city: { name: 'Moscow' }, eyeColor: { name: 'Blue' }, hairColor: { name: 'Black' },
                photos: [], skills: [], languages: [], videos, videoURL: videos[0]?.url || '',
            };
            return route.fulfill({ json: data });
        });
        await page.route('**' + src + '*', route => route.fulfill({ contentType: 'video/mp4', body: fs.readFileSync(fixture) }));
        await page.goto('/actors/test');
        await expect(page.getByRole('button', { name: 'Добавить видео' })).toBeEnabled();
        const input = page.locator('.actor-video-editor input[type=file]');
        await input.setInputFiles(fixture);
        const selection = page.getByRole('combobox', { name: 'Выбрать видео' });
        await expect(selection.locator('option')).toHaveCount(1);
        const firstId = videos[0].id;
        const firstURL = videos[0].url;
        await input.setInputFiles(fixture);
        await expect(selection.locator('option')).toHaveCount(2);
        await expect(selection).toHaveValue(videos[1].id);
        await selection.selectOption(firstId);
        const video = page.locator('.actor-video video');
        await expect(video).toHaveAttribute('src', firstURL);
        await expect(video).toBeVisible();
        await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.readyState)).toBeGreaterThan(1);
        await video.evaluate((el: HTMLVideoElement) => { el.muted = true; return el.play(); });
        await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime)).toBeGreaterThan(0.1);
        await video.evaluate((el: HTMLVideoElement) => { el.currentTime = 2; });
        await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime)).toBeGreaterThanOrEqual(2);
        await video.evaluate((el: HTMLVideoElement) => el.pause());
        await expect.poll(() => video.evaluate((el: HTMLVideoElement) => !el.seeking && el.readyState >= 2)).toBe(true);
        const colors = await video.evaluate((el: HTMLVideoElement) => {
            const canvas = document.createElement('canvas'); canvas.width = 64; canvas.height = 36;
            const context = canvas.getContext('2d')!;
            context.drawImage(el, 0, 0, 64, 36);
            return new Set(context.getImageData(0, 0, 64, 36).data).size;
        });
        expect(colors).toBeGreaterThan(10);
        await expect(page.locator('.actor-video [role=alert]')).toHaveCount(0);
        const box = await page.locator('.actor-video').boundingBox();
        expect(box!.width).toBeGreaterThan(100);
        expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width + 1);
        await page.locator('.actor-video').scrollIntoViewIfNeeded();
        await page.locator('.actor-videos').screenshot({ path: testInfo.outputPath('player.png') });
        await expect(page.locator('.plyr__controls')).toBeVisible();
        const controlsBox = await page.locator('.plyr__controls').boundingBox();
        const playerBox = await page.locator('.actor-video').boundingBox();
        expect(controlsBox!.y + controlsBox!.height).toBeLessThanOrEqual(playerBox!.y + playerBox!.height + 1);
        failUpload = true;
        await input.setInputFiles(fixture);
        await expect(page.getByRole('alert')).toContainText('HTTP 500');
        await expect(selection.locator('option')).toHaveCount(2);
        await expect(video).toHaveAttribute('src', firstURL);
        failUpload = false;
        const chooser = page.waitForEvent('filechooser');
        await page.getByRole('button', { name: 'Заменить выбранное' }).click();
        await (await chooser).setFiles(fixture);
        await expect(page.getByRole('button', { name: 'Заменить выбранное' })).toBeEnabled();
        await expect(video).not.toHaveAttribute('src', firstURL);
        await expect(selection.locator('option')).toHaveCount(2);
        page.once('dialog', dialog => dialog.accept());
        await page.getByRole('button', { name: 'Удалить выбранное' }).click();
        await expect(selection.locator('option')).toHaveCount(1);
        await expect(video).toHaveAttribute('src', videos[0].url);
        await page.reload();
        await expect(selection.locator('option')).toHaveCount(1);
        page.once('dialog', dialog => dialog.accept());
        await page.getByRole('button', { name: 'Удалить выбранное' }).click();
        await expect(video).toHaveCount(0);
        await expect(page.getByRole('button', { name: 'Добавить видео' })).toBeEnabled();
        expect(errors).toEqual([]);
    });
}

for (const local of [true, false]) {
    test(`catalog modal ${local ? 'local video' : 'legacy embed'}`, async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        const videoURL = local ? src : 'https://example.org/embed/legacy';
        await page.route('https://example.org/**', route => route.fulfill({ contentType: 'text/html', body: '<p>Legacy embed</p>' }));
        await page.route('**/api/**', route => route.fulfill({ json: new URL(route.request().url()).pathname === '/api/actor/get/men'
            ? [{ id: 'test', firstName: 'Test', lastName: 'Actor', directory: 'test', videoURL,
                videos: local ? [{ id: 'local', url: src, name: 'Local' },
                    { id: 'legacy', url: 'https://example.org/embed/legacy', name: 'Legacy' }] : [],
            }] : [] }));
        await page.route('**' + src, route => route.fulfill({ contentType: 'video/mp4', body: fs.readFileSync(fixture) }));
        await page.goto('/actors/men');
        await page.locator('.card_video_icon').click();
        const media = page.locator(local ? '.video_modal video' : '.video_modal iframe');
        await expect(media).toBeVisible();
        await expect(media).toHaveAttribute('src', videoURL);
        const box = await media.boundingBox();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(390);
        if (local) {
            await page.getByRole('combobox', { name: 'Выбрать видео' }).selectOption('legacy');
            await expect(page.locator('.video_modal video')).toHaveCount(0);
            await expect(page.locator('.video_modal iframe')).toHaveAttribute('src', 'https://example.org/embed/legacy');
        }
        await page.locator('.video_modal_close').click();
        await expect(media).toHaveCount(0);
    });
}
