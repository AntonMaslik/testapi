import { CommonEntity } from 'src/common/common.entity';
import { UserEntity } from 'src/users/entity/user.entity';
import {
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    Entity,
    JoinColumn,
} from 'typeorm';

@Entity('tokens')
export class TokenEntity extends CommonEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    refreshToken: string;

    @ManyToOne(() => UserEntity, (user) => user.id)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @Column()
    userId: number;
}
