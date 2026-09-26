const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const { randomUUID } = require('node:crypto');
const { execFileSync } = require('node:child_process');
const express = require('express');

process.env.VIDEO_MAX_BYTES = String(1024 * 1024);
const { appDataSource: db } = require('../build/data-source');
const { Actor } = require('../build/models/actor.entity');
const router = require('../build/route/actorVideoRouter').default;
const { signAccessToken } = require('../build/controller/auth/jwt');
const { errorMiddleware } = require('../build/middleware/errorMiddleware');

async function main() {
    db.setOptions({ synchronize: false });
    await db.initialize();
    const repo = db.getRepository(Actor);
    const before = await repo.count();
    const base = (await repo.find({ take: 1 }))[0];
    assert.ok(base, 'A fixture actor is required in the test database');
    const id = randomUUID();
    const directory = `video-test-${id}`;
    const folder = path.resolve(__dirname, '../uploads', directory);
    const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'actor-video-test-'));
    const fixture = path.join(temp, 'fixture.mp4');
    let server;
    try {
        execFileSync(require('ffmpeg-static'), ['-v', 'error', '-f', 'lavfi', '-i', 'testsrc=size=320x180:rate=24',
            '-t', '2', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', fixture]);
        const bytes = await fs.readFile(fixture);
        await repo.save(repo.create({ ...base, id, directory, firstName: 'VideoTest', photos: [], languages: [], videoURL: 'https://example.org/embed/legacy' }));
        const app = express();
        app.use('/api/actor-video', router);
        app.use(express.json());
        app.post('/profile', require('../build/controller/actor/editActor').editActor);
        app.use('/uploads', require('../build/middleware/uploadStatic').uploadStatic);
        app.use(errorMiddleware);
        server = await new Promise(resolve => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
        const origin = `http://127.0.0.1:${server.address().port}`;
        const endpoint = `${origin}/api/actor-video/${id}`;
        const token = admin => signAccessToken({ id, name: 'Test', email: 'test@example.org', isAdmin: admin });
        const headers = { Authorization: `Bearer ${token(true)}` };
        const upload = (data, auth = headers) => {
            const body = new FormData(); body.append('video', new Blob([data], { type: 'video/mp4' }), 'clip.mp4');
            return fetch(endpoint, { method: 'POST', headers: auth, body });
        };
        assert.equal((await upload(bytes, {})).status, 401);
        assert.equal((await upload(bytes, { Authorization: `Bearer ${token(false)}` })).status, 403);
        assert.equal((await upload(Buffer.from('not a video'))).status, 400);
        assert.equal((await repo.findOneBy({ id })).videoURL, 'https://example.org/embed/legacy');
        const first = await upload(bytes);
        assert.equal(first.status, 200, await first.clone().text());
        const firstURL = (await first.json()).videoURL;
        const range = await fetch(origin + firstURL, { headers: { Range: 'bytes=0-99' } });
        assert.equal(range.status, 206);
        assert.equal((await range.arrayBuffer()).byteLength, 100);
        assert.equal(range.headers.get('content-type'), 'video/mp4');
        assert.equal((await upload(Buffer.alloc(1024 * 1024 + 1))).status, 413);
        assert.equal((await repo.findOneBy({ id })).videoURL, firstURL);
        const profile = await fetch(origin + '/profile', { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, firstName: 'VideoTestEdited', videoURL: 'stale-url' }) });
        assert.equal(profile.status, 200, await profile.clone().text());
        assert.equal((await profile.json()).videoURL, firstURL);
        const transaction = db.transaction.bind(db);
        db.transaction = work => transaction(manager => {
            manager.update = async () => { throw new Error('Simulated DB failure'); };
            return work(manager);
        });
        try { assert.equal((await upload(bytes)).status, 500); } finally { db.transaction = transaction; }
        assert.equal((await repo.findOneBy({ id })).videoURL, firstURL);
        assert.equal((await fs.readdir(folder)).length, 1);
        const second = await upload(bytes);
        assert.equal(second.status, 200);
        const secondURL = (await second.json()).videoURL;
        assert.notEqual(firstURL, secondURL);
        assert.equal((await fetch(origin + firstURL)).status, 404);
        assert.equal((await fetch(origin + secondURL)).status, 200);
        assert.equal((await fetch(endpoint, { method: 'DELETE', headers })).status, 200);
        assert.equal((await repo.findOneBy({ id })).videoURL, '');
        assert.equal((await fetch(origin + secondURL)).status, 404);
        console.log('PASS: access, invalid format, upload, range, size limit, profile edit, DB failure rollback, replacement, deletion');
    } finally {
        if (server) await new Promise(resolve => server.close(resolve));
        await repo.delete(id);
        assert.ok(folder.startsWith(path.resolve(__dirname, '../uploads') + path.sep));
        await fs.rm(folder, { recursive: true, force: true });
        await fs.rm(temp, { recursive: true, force: true });
        assert.equal(await repo.count(), before);
        await db.destroy();
    }
}
main().catch(async error => { console.error(error); if (db.isInitialized) await db.destroy(); process.exitCode = 1; });
