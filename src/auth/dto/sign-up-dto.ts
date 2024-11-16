import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class SignUpDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail({}, { message: 'Please enter correct email' })
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
}
