const assert = require('node:assert/strict');
const express = require('express');
const { appDataSource } = require('../build/data-source');
const { signAccessToken } = require('../build/controller/auth/jwt');
const router = require('../build/route/actorRouter').default;
const { errorMiddleware } = require('../build/middleware/errorMiddleware');

async function main() {
    let ids = ['a', 'b', 'c'];
    appDataSource.transaction = async work => {
        const next = [];
        const qb = { where() { return this; }, orderBy() { return this; }, addOrderBy() { return this; },
            async getMany() { return ids.map(id => ({ id })); } };
        await work({ query: async () => {}, createQueryBuilder: () => qb,
            update: async (_, id, patch) => { next[patch.sortOrder] = id; } });
        ids = next;
    };
    const app = express(); app.use(express.json()); app.use(router); app.use(errorMiddleware);
    const server = await new Promise(resolve => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
    const token = admin => signAccessToken({ id: 'test', isAdmin: admin, email: 'test@example.org', name: 'Test' });
    const send = (body, auth = token(true)) => fetch(`http://127.0.0.1:${server.address().port}/order`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...(auth ? { Authorization: `Bearer ${auth}` } : {}) }, body: JSON.stringify(body),
    });
    const body = { gender: 'M', ids: ['c', 'a', 'b'], originalIds: ['a', 'b', 'c'] };
    try {
        assert.equal((await send(body, '')).status, 401);
        assert.equal((await send(body, token(false))).status, 403);
        assert.equal((await send({ ...body, ids: ['a', 'a', 'b'] })).status, 400);
        assert.equal((await send({ ...body, ids: ['a', 'b', 'other'] })).status, 400);
        assert.equal((await send(body)).status, 200);
        assert.deepEqual(ids, ['c', 'a', 'b']);
        assert.equal((await send(body)).status, 400);
        assert.deepEqual(ids, ['c', 'a', 'b']);
        console.log('PASS: admin access, membership, duplicates, saving, stale order');
    } finally { await new Promise(resolve => server.close(resolve)); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
