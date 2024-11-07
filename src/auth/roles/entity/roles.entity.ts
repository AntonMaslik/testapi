import { UserEntity } from 'src/users/entity/user.entity';
import { Entity, JoinColumn, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity('roles')
export class RolesEntity {
    @PrimaryColumn()
    name: string;

    @ManyToMany(() => UserEntity, (user) => user.roles)
    users?: UserEntity[];
}
