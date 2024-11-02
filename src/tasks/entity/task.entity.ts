import { CommonEntity } from 'src/common/common.entity';
import { WorkspaceEntity } from 'src/workspaces/entity/workspace.entity';
import {
    PrimaryGeneratedColumn,
    Column,
    Entity,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

@Entity('tasks')
export class TaskEntity extends CommonEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    completed: boolean;

    @Column()
    position: number;

    @ManyToOne(() => WorkspaceEntity, (workspace) => workspace.id, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'workspaceId' })
    workspaceId: number;
}
