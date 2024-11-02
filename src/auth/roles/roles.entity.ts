import { UserEntity } from 'src/users/entity/user.entity';
import { Column, JoinColumn, ManyToMany, PrimaryColumn, Unique } from 'typeorm';

@Unique('uniq_role_name', ['roles'])
export class RolesEntity {
    @PrimaryColumn()
    @Column()
    name: string;

    @ManyToMany(() => UserEntity, (user) => user.roles, { eager: true })
    @JoinColumn()
    users: UserEntity[];
}
