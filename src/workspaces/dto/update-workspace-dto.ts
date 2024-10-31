import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class UpdateWorkspaceDto {
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
