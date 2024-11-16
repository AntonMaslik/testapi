import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTokensTable1731578792630 implements MigrationInterface {
    name = 'AddTokensTable1731578792630'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workspaces" DROP CONSTRAINT "FK_dc53b3d0b16419a8f5f17458403"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_f88dbead7aecbf13a1b40f7c882"`);
        await queryRunner.query(`CREATE TABLE "tokens" ("deletedAt" TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "refreshToken" character varying NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refreshToken"`);
        await queryRunner.query(`ALTER TABLE "workspaces" ADD CONSTRAINT "FK_dc53b3d0b16419a8f5f17458403" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_f88dbead7aecbf13a1b40f7c882" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tokens" ADD CONSTRAINT "FK_d417e5d35f2434afc4bd48cb4d2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "FK_d417e5d35f2434afc4bd48cb4d2"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_f88dbead7aecbf13a1b40f7c882"`);
        await queryRunner.query(`ALTER TABLE "workspaces" DROP CONSTRAINT "FK_dc53b3d0b16419a8f5f17458403"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "refreshToken" character varying`);
        await queryRunner.query(`DROP TABLE "tokens"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_f88dbead7aecbf13a1b40f7c882" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workspaces" ADD CONSTRAINT "FK_dc53b3d0b16419a8f5f17458403" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
