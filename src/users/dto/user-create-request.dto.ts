import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { RolesEntity } from 'src/auth/roles/roles.entity';

export class UserCreateRequestDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    refreshToken: string;

    roles: RolesEntity[];
}
