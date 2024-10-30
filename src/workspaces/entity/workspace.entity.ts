import { UserEntity } from 'src/users/entity/user.entity';
import {Column, Entity, PrimaryGeneratedColumn, IsNull, ManyToMany, JoinColumn} from 'typeorm'

export class Workspace {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => UserEntity, user => user.id)
    @JoinColumn({name: 'id'})
    userId: UserEntity
}
