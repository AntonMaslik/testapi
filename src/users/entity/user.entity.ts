import {Column, Entity, PrimaryGeneratedColumn, IsNull} from 'typeorm'

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column({nullable: true })
    refreshToken: string;
}
