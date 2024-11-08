import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { RolesEntity } from 'src/auth/roles/entity/roles.entity';
import { Exclude } from 'class-transformer';
import { CommonEntity } from 'src/common/common.entity';

@Entity('users')
export class UserEntity extends CommonEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Exclude()
    @Column()
    password: string;

    @Exclude()
    @Column({ nullable: true })
    refreshToken: string;

    @ManyToMany(() => RolesEntity, (role) => role.users)
    @JoinTable()
    roles: RolesEntity[];
}
