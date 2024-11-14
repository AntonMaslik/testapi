import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
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
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column()
    description: string;

    @ApiProperty()
    @Column()
    completed: boolean;

    @ApiProperty()
    @Column()
    position: number;

    @ManyToOne(() => WorkspaceEntity, (workspace) => workspace.id)
    @JoinColumn({ name: 'workspaceId' })
    workspace: WorkspaceEntity;

    @ApiProperty()
    @Exclude()
    @Column()
    workspaceId: number;
}
