import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { RolesEntity } from 'src/auth/roles/entity/roles.entity';

export class UserCreateRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty()
    refreshToken: string;

    @ApiProperty()
    roles: RolesEntity[];
}
