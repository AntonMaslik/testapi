import { ApiProperty } from '@nestjs/swagger';

import { CommonEntity } from 'src/common/common.entity';
import { UserEntity } from 'src/users/entity/user.entity';

import {
    Column,
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToOne,
    Entity,
} from 'typeorm';

@Entity('workspaces')
export class WorkspaceEntity extends CommonEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    name: string;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @ApiProperty()
    @Column()
    userId: number;

    @ApiProperty()
    @Column()
    description: string;
}
