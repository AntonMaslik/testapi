import { UserEntity } from 'src/users/entity/user.entity';
import { Column, Entity, JoinColumn, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity('roles')
export class RolesEntity {
    @PrimaryColumn()
    name: string;

    @ManyToMany(() => UserEntity, (user) => user.roles)
    @JoinColumn()
    users?: UserEntity[];
}
