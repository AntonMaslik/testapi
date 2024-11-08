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
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @Column()
    userId: number;

    @Column()
    description: string;
}
