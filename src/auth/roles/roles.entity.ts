import { UserEntity } from 'src/users/entity/user.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToMany,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';

@Entity('roles')
export class RolesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    // TODO: rename => name
    roleName: string;

    @ManyToMany(() => UserEntity, (user) => user.roles)
    @JoinColumn()
    users: UserEntity[];
}

// @Unique('uniq_role_name', ['roles'])
// export class RolesEntity1 {
//     @PrimaryColumn()
//     @Column()
//     // TODO: rename => name
//     name: string;

//     @ManyToMany(() => UserEntity, (user) => user.roles)
//     @JoinColumn()
//     users: UserEntity[];
// }
