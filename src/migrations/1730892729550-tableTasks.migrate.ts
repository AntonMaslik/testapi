import { MigrationInterface, QueryRunner } from 'typeorm';

export class tableTasksMigrate1730892729550 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
              CREATE TABLE IF NOT EXISTS tasks
            (
                "deletedAt" timestamp without time zone,  
                "updatedAt" timestamp without time zone NOT NULL DEFAULT now(),  
                "createdAt" timestamp without time zone NOT NULL DEFAULT now(),  
                id serial PRIMARY KEY,  
                name VARCHAR NOT NULL, 
                description VARCHAR NOT NULL,  
                completed boolean NOT NULL,  
                "position" integer NOT NULL,  
                "workspaceId" integer NOT NULL,  
                CONSTRAINT "FK_f88dbead7aecbf13a1b40f7c882" FOREIGN KEY ("workspaceId")
                    REFERENCES workspaces (id) MATCH SIMPLE  
                    ON UPDATE NO ACTION  
                    ON DELETE CASCADE 
            )
            `,
        );
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS tasks CASCADE;`);
    }
}
