import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity("tasks")
export class TaskEntity {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    name: string

    @Column()
    description: string;

    @Column()
    password: string;
}
