import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class ActorOrder1790800000000 implements MigrationInterface {
    async up(runner: QueryRunner): Promise<void> {
        if (await runner.hasTable("actor") && !await runner.hasColumn("actor", "sortOrder")) {
            await runner.addColumn("actor", new TableColumn({ name: "sortOrder", type: "int", default: "2147483647" }))
        }
    }
    async down(): Promise<void> {
        throw new Error("Restore a backup to roll back actor ordering")
    }
}
