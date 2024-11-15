import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class UserUpdateRequestDto {
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
}
