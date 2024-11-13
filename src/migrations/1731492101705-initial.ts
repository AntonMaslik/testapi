import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1731492101705 implements MigrationInterface {
    name = 'Initial1731492101705';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "roles" ("name" character varying NOT NULL, CONSTRAINT "PK_648e3f5447f725579d7d4ffdfb7" PRIMARY KEY ("name"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "users" ("deletedAt" TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "refreshToken" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "workspaces" ("deletedAt" TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying NOT NULL, "userId" integer NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_098656ae401f3e1a4586f47fd8e" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "tasks" ("deletedAt" TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "completed" boolean NOT NULL, "position" integer NOT NULL, "workspaceId" integer NOT NULL, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "users_roles_roles" ("usersId" integer NOT NULL, "rolesName" character varying NOT NULL, CONSTRAINT "PK_bb733106f0e30e138ab4940a293" PRIMARY KEY ("usersId", "rolesName"))`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_df951a64f09865171d2d7a502b" ON "users_roles_roles" ("usersId") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_9fc16941d812c4d99e9eb6c279" ON "users_roles_roles" ("rolesName") `,
        );
        await queryRunner.query(
            `ALTER TABLE "workspaces" ADD CONSTRAINT "FK_dc53b3d0b16419a8f5f17458403" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "tasks" ADD CONSTRAINT "FK_f88dbead7aecbf13a1b40f7c882" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "users_roles_roles" ADD CONSTRAINT "FK_df951a64f09865171d2d7a502b1" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE "users_roles_roles" ADD CONSTRAINT "FK_9fc16941d812c4d99e9eb6c2798" FOREIGN KEY ("rolesName") REFERENCES "roles"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users_roles_roles" DROP CONSTRAINT "FK_9fc16941d812c4d99e9eb6c2798"`,
        );
        await queryRunner.query(
            `ALTER TABLE "users_roles_roles" DROP CONSTRAINT "FK_df951a64f09865171d2d7a502b1"`,
        );
        await queryRunner.query(
            `ALTER TABLE "tasks" DROP CONSTRAINT "FK_f88dbead7aecbf13a1b40f7c882"`,
        );
        await queryRunner.query(
            `ALTER TABLE "workspaces" DROP CONSTRAINT "FK_dc53b3d0b16419a8f5f17458403"`,
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_9fc16941d812c4d99e9eb6c279"`,
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_df951a64f09865171d2d7a502b"`,
        );
        await queryRunner.query(`DROP TABLE "users_roles_roles"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TABLE "workspaces"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }
}
