import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity("tasks")
export class TaskEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string

    @Column()
    description: string;

    @Column()
    workspace_id: number;

    @Column()
    completed: boolean;
}
