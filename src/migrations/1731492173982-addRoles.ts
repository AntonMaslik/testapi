import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoles1731492173982 implements MigrationInterface {
    name = 'AddRoles1731492173982';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
                INSERT INTO "roles" (name)
                VALUES ('ADMIN');
        `,
        );

        await queryRunner.query(
            `
                INSERT INTO "roles" (name)
                VALUES ('USER');
        `,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
                DELETE FROM "roles"
                WHERE name='ADMIN'
        `,
        );

        await queryRunner.query(
            `
                DELETE FROM "roles"
                WHERE name='USER'
        `,
        );
    }
}
