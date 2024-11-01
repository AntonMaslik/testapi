import { UserEntity } from 'src/users/entity/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class RolesEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    roleName: string;

    @ManyToMany(() => UserEntity, (user) => user.roles)
    users: UserEntity[];
}
