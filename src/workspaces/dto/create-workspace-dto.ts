import {IsNotEmpty, IsNumber, IsString} from "class-validator"

export class CreateWorkspaceDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    userId: number

    @IsString()
    @IsNotEmpty()
    description: string
}
