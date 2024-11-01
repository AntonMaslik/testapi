import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { RolesEntity } from 'src/auth/roles/roles.entity';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    refreshToken: string;

    @ManyToMany(() => RolesEntity, (role) => role.users)
    roles: RolesEntity[];
}
