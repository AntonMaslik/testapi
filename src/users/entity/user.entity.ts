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
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class UserEntity extends CommonEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column({ unique: true })
    email: string;

    @ApiProperty()
    @Exclude()
    @Column()
    password: string;

    @ManyToMany(() => RolesEntity, (role) => role.users, {
        onDelete: 'CASCADE',
    })
    @JoinTable()
    roles: RolesEntity[];
}
