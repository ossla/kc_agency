import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class ActorVideos1790440000000 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        // A fresh installation creates the actor table through the existing synchronize setting.
        if (await queryRunner.hasTable("actor") && !await queryRunner.hasColumn("actor", "videos")) {
            await queryRunner.addColumn("actor", new TableColumn({
                name: "videos", type: "jsonb", isNullable: false, default: "'[]'::jsonb",
            }))
        }
    }

    async down(): Promise<void> {
        throw new Error("Automatic rollback would discard actor videos. Restore a database backup instead.")
    }
}
