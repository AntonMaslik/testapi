import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateWorkspaceDto {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsString()
    @IsNotEmpty()
    description: string;
}
