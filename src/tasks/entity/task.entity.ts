import { CommonEntity } from "src/common/common.entity";
import { PrimaryGeneratedColumn, Column, Entity, BaseEntity } from "typeorm";

@Entity("tasks")
export class TaskEntity extends CommonEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string

    @Column()
    description: string;

    @Column()
    workspaceId: number;

    @Column()
    completed: boolean;

    @Column()
    position: number;
}
