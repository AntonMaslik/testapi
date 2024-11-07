import { MigrationInterface, QueryRunner } from 'typeorm';

export class tableWorkspacesMigrate1730892729540 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `
                CREATE TABLE IF NOT EXISTS workspaces
                (
                    "deletedAt" timestamp without time zone,  
                    "updatedAt" timestamp without time zone NOT NULL DEFAULT now(),  
                    "createdAt" timestamp without time zone NOT NULL DEFAULT now(),  
                    id serial PRIMARY KEY,  
                    name VARCHAR NOT NULL,  
                    description VARCHAR NOT NULL, 
                    "userId" integer NOT NULL,  
                    CONSTRAINT "FK_dc53b3d0b16419a8f5f17458403" FOREIGN KEY ("userId")
                        REFERENCES users (id) MATCH SIMPLE 
                        ON UPDATE NO ACTION  
                        ON DELETE CASCADE  
                );
            `,
        );
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP TABLE IF EXISTS public.workspaces CASCADE;`,
        );
    }
}
