import { Exclude, Expose } from 'class-transformer';
import { CommonEntity } from 'src/common/common.entity';
import { UserEntity } from 'src/users/entity/user.entity';
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
    workspace: WorkspaceEntity;

    @Exclude()
    @Column()
    workspaceId: number;
}
