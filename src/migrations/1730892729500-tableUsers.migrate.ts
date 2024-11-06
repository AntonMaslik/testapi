import { MigrationInterface, QueryRunner } from 'typeorm';

export class tableUserMigrate1730892729500 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
            CREATE TABLE IF NOT EXISTS users
            (
                id serial PRIMARY KEY,  
                name VARCHAR NOT NULL,   
                email VARCHAR NOT NULL,  
                password VARCHAR NOT NULL, 
                "refreshToken" VARCHAR,   
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email)  
            );
            `,
        );
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS users CASCADE;`);
    }
}
