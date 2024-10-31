import { UserEntity } from 'src/users/entity/user.entity';
import {Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne} from 'typeorm'

export class WorkspaceEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(() => UserEntity, user => user.id)
    @JoinColumn({name: 'id'})
    userId: number

    @Column()
    description: string
}
