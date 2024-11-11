import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entity/user.entity';
import { Entity, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity('roles')
export class RolesEntity {
    @ApiProperty()
    @PrimaryColumn()
    name: string;

    @ManyToMany(() => UserEntity, (user) => user.roles)
    users?: UserEntity[];
}
