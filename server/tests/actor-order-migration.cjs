const assert = require('node:assert/strict');
const { appDataSource: db } = require('../build/data-source');
const { ActorOrder1790800000000 } = require('../build/migrations/1790800000000-ActorOrder');
const { Actor } = require('../build/models/actor.entity');
async function main() {
    db.setOptions({ synchronize: false, migrationsRun: false });
    await db.initialize();
    const runner = db.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    try {
        const before = await runner.query('SELECT id FROM actor ORDER BY id');
        const migration = new ActorOrder1790800000000();
        await migration.up(runner);
        await migration.up(runner);
        assert.deepEqual(await runner.query('SELECT id FROM actor ORDER BY id'), before);
        await runner.manager.createQueryBuilder(Actor, 'actor').select(['actor.id'])
            .orderBy('actor.sortOrder', 'ASC').addOrderBy('LOWER(actor.lastName)', 'ASC').getMany();
        console.log('PASS: migration is repeatable, existing actors preserved, ordered query works (rolled back)');
    } finally {
        await runner.rollbackTransaction(); await runner.release(); await db.destroy();
    }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
