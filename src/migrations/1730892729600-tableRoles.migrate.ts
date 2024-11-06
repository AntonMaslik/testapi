import { MigrationInterface, QueryRunner } from 'typeorm';

export class tablesRolesMigrate1730892729600 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
                CREATE TABLE IF NOT EXISTS roles
                (
                    name VARCHAR NOT NULL, 
                    CONSTRAINT "PK_648e3f5447f725579d7d4ffdfb7" PRIMARY KEY (name)  
                );
            `,
        );
        await queryRunner.query(
            `
                CREATE TABLE IF NOT EXISTS users_roles_roles
                (
                    "usersId" integer NOT NULL,  
                    "rolesName" character varying NOT NULL,  
                    CONSTRAINT "PK_bb733106f0e30e138ab4940a293" PRIMARY KEY ("usersId", "rolesName"),  
                    CONSTRAINT "FK_9fc16941d812c4d99e9eb6c2798" FOREIGN KEY ("rolesName")
                        REFERENCES roles (name) MATCH SIMPLE  
                        ON UPDATE NO ACTION  
                        ON DELETE NO ACTION,  
                    CONSTRAINT "FK_df951a64f09865171d2d7a502b1" FOREIGN KEY ("usersId")
                        REFERENCES users (id) MATCH SIMPLE  
                        ON UPDATE CASCADE  
                        ON DELETE CASCADE  
                );
            `,
        );
        await queryRunner.query(
            `
                INSERT INTO roles (name)
                VALUES ('ADMIN');
            `,
        );
        await queryRunner.query(
            `
                INSERT INTO roles (name)
                VALUES ('USER');
            `,
        );
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS roles CASCADE;`);
        await queryRunner.query(
            `DROP TABLE IF EXISTS users_roles_roles CASCADE`,
        );
    }
}
