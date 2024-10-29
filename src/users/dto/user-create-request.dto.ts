import { IsNotEmpty, IsEmail, MinLength, IsArray } from "class-validator"

export class UserCreateRequestDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @MinLength(6)
    password: string

    admin: boolean = false;
}
