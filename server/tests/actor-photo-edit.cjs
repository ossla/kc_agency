const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const express = require('express');
const { appDataSource: db } = require('../build/data-source');
const { Actor } = require('../build/models/actor.entity');
const { signAccessToken } = require('../build/controller/auth/jwt');
const router = require('../build/route/actorRouter').default;
const { errorMiddleware } = require('../build/middleware/errorMiddleware');
async function main() {
    db.setOptions({ synchronize: false, migrationsRun: false }); await db.initialize();
    const repo = db.getRepository(Actor), id = randomUUID();
    const folder = path.resolve(__dirname, '../uploads', id);
    let server;
    try {
        const base = (await repo.find({ take: 1 }))[0]; assert.ok(base);
        await repo.save(repo.create({ ...base, id, directory: id, photos: ['one', 'two'], languages: [] }));
        await fs.mkdir(folder);
        for (const photo of ['one', 'two']) for (const size of [400, 1600]) await fs.writeFile(path.join(folder, `${photo}_${size}.jpg`), 'fixture');
        const app = express(); app.use(express.json()); app.use(router); app.use(errorMiddleware);
        server = await new Promise(resolve => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
        const token = signAccessToken({ id, name: 'Test', email: 'test@example.org', isAdmin: true });
        const send = (action, body, authorized = true) => fetch(`http://127.0.0.1:${server.address().port}/edit/${action}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', ...(authorized ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ id, ...body }),
        });
        assert.equal((await send('changeOrderAlbum', { photos: ['two', 'one'] }, false)).status, 401);
        assert.equal((await send('changeOrderAlbum', { photos: ['two', 'one', 'one'] })).status, 400);
        assert.equal((await send('changeOrderAlbum', { photos: ['two', 'one'] })).status, 200);
        assert.deepEqual((await repo.findOneBy({ id })).photos, ['two', 'one']);
        const transaction = db.transaction.bind(db);
        db.transaction = work => transaction(manager => { manager.update = async () => { throw new Error('Simulated failure'); }; return work(manager); });
        try { assert.equal((await send('deleteFromAlbum', { photoId: 'one' })).status, 500); } finally { db.transaction = transaction; }
        await fs.access(path.join(folder, 'one_400.jpg'));
        assert.deepEqual((await repo.findOneBy({ id })).photos, ['two', 'one']);
        assert.equal((await send('deleteFromAlbum', { photoId: 'one' })).status, 200);
        await assert.rejects(fs.access(path.join(folder, 'one_400.jpg')));
        assert.equal((await send('changeOrderAlbum', { photos: ['one', 'two'] })).status, 400);
        assert.deepEqual((await repo.findOneBy({ id })).photos, ['two']);
        assert.equal((await send('deleteFromAlbum', { photoId: 'two' })).status, 200);
        assert.deepEqual((await repo.findOneBy({ id })).photos, []);
        console.log('PASS: access, reorder, duplicate/stale lists, delete, DB failure preserves files');
    } finally {
        if (server) await new Promise(resolve => server.close(resolve));
        await repo.delete(id);
        assert.equal(path.dirname(folder), path.resolve(__dirname, '../uploads'));
        await fs.rm(folder, { recursive: true, force: true }); await db.destroy();
    }
}
main().catch(async error => { console.error(error); if (db.isInitialized) await db.destroy(); process.exitCode = 1; });
