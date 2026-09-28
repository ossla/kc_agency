const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const express = require('express');
const fileUpload = require('express-fileupload');
const sharp = require('sharp');
const { appDataSource: db } = require('../build/data-source');
const { Employee } = require('../build/models/employee.entity');
const { Actor } = require('../build/models/actor.entity');
const router = require('../build/route/employeeRouter').default;
const { signAccessToken } = require('../build/controller/auth/jwt');
const { errorMiddleware } = require('../build/middleware/errorMiddleware');

async function main() {
    db.setOptions({ synchronize: false, migrationsRun: false });
    await db.initialize();
    const employees = db.getRepository(Employee);
    const actors = db.getRepository(Actor);
    const before = await employees.count();
    const id = randomUUID(), otherId = randomUUID(), actorId = randomUUID();
    const photo = `employee-test-${randomUUID()}`;
    const root = path.resolve(__dirname, '../uploads');
    const photos = new Set([photo]);
    let server;
    try {
        await fs.mkdir(root, { recursive: true });
        const picture = await sharp({ create: { width: 80, height: 100, channels: 3, background: '#268478' } }).jpeg().toBuffer();
        for (const size of [400, 1600]) await fs.writeFile(path.join(root, `${photo}_${size}.jpg`), picture);
        const phone = String(Date.now());
        await employees.save([
            employees.create({ id, firstName: 'Agent', lastName: 'Test', middleName: 'Middle', email: `${id}@example.org`, phone, photo,
                description: 'Before', telegram: 'before', vk: 'https://vk.com/before', instagram: 'https://instagram.com/before', facebook: 'https://facebook.com/before' }),
            employees.create({ id: otherId, firstName: 'Other', lastName: 'Agent', email: `${otherId}@example.org`, phone: phone + '1', photo: 'unused-test-photo' }),
        ]);
        const base = (await actors.find({ take: 1 }))[0];
        assert.ok(base, 'A fixture actor is required in the test database');
        await actors.save(actors.create({ ...base, id: actorId, directory: actorId, photos: [], videos: [], videoURL: '', languages: [], employee: await employees.findOneBy({ id }) }));
        const app = express();
        app.use(express.json()); app.use(fileUpload()); app.use('/api/employee', router); app.use(errorMiddleware);
        server = await new Promise(resolve => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
        const url = `http://127.0.0.1:${server.address().port}/api/employee/edit`;
        const authorization = admin => ({ Authorization: `Bearer ${signAccessToken({ id, name: 'Test', email: 'test@example.org', isAdmin: admin })}` });
        const send = (changes, image, headers = authorization(true)) => {
            const body = new FormData(); body.append('id', id);
            for (const [key, value] of Object.entries(changes)) body.set(key, value);
            if (image) body.append('newAvatar', new Blob([image], { type: 'image/jpeg' }), 'avatar.jpg');
            return fetch(url, { method: 'POST', headers, body });
        };
        assert.equal((await send({ firstName: 'Blocked' }, undefined, {})).status, 401);
        assert.equal((await send({ firstName: 'Blocked' }, undefined, authorization(false))).status, 403);
        for (const changes of [{ firstName: ' ' }, { email: 'bad' }, { phone: '' }, { firstName: 'a'.repeat(41) }, { vk: 'javascript:alert(1)' }]) {
            assert.equal((await send(changes)).status, 400);
        }
        const response = await send({ firstName: 'Updated', middleName: '', description: '', telegram: '', vk: '', instagram: '', facebook: '' });
        assert.equal(response.status, 200, await response.clone().text());
        const updated = await response.json();
        assert.equal(updated.firstName, 'Updated');
        for (const key of ['middleName', 'description', 'telegram', 'vk', 'instagram', 'facebook']) assert.equal(updated[key], '');
        assert.equal(updated.photo, photo);
        assert.equal((await actors.findOneBy({ id: actorId })).employee.id, id);
        for (const changes of [{ email: `${otherId}@example.org` }, { phone: phone + '1' }]) {
            assert.equal((await send(changes, picture)).status, 409);
            assert.equal((await employees.findOneBy({ id })).photo, photo);
        }
        assert.equal((await send({}, Buffer.from('not an image'))).status, 400);
        const filesBefore = await fs.readdir(root);
        const transaction = db.transaction.bind(db);
        db.transaction = work => transaction(manager => {
            manager.update = async () => { throw new Error('Simulated DB failure'); }; return work(manager);
        });
        try { assert.equal((await send({ firstName: 'Must not persist' }, picture)).status, 500); }
        finally { db.transaction = transaction; }
        assert.deepEqual(await fs.readdir(root), filesBefore);
        assert.equal((await employees.findOneBy({ id })).firstName, 'Updated');
        const avatarResponse = await send({ description: 'New description' }, picture);
        assert.equal(avatarResponse.status, 200, await avatarResponse.clone().text());
        const withAvatar = await avatarResponse.json();
        photos.add(withAvatar.photo);
        assert.notEqual(withAvatar.photo, photo);
        for (const size of [400, 1600]) {
            await assert.rejects(fs.access(path.join(root, `${photo}_${size}.jpg`)));
            await fs.access(path.join(root, `${withAvatar.photo}_${size}.jpg`));
        }
        assert.equal((await actors.findOneBy({ id: actorId })).employee.photo, withAvatar.photo);
        assert.equal((await send({ id: randomUUID() })).status, 404);
        console.log('PASS: admin access, validation, optional-field clearing, unique contacts, avatar replacement, DB failure cleanup, actor relation preservation');
    } finally {
        if (server) await new Promise(resolve => server.close(resolve));
        await actors.delete(actorId);
        await employees.delete([id, otherId]);
        for (const name of photos) for (const size of [400, 1600]) {
            await fs.unlink(path.join(root, `${name}_${size}.jpg`)).catch(error => { if (error.code !== 'ENOENT') throw error; });
        }
        assert.equal(await employees.count(), before);
        await db.destroy();
    }
}
main().catch(async error => { console.error(error); if (db.isInitialized) await db.destroy(); process.exitCode = 1; });
