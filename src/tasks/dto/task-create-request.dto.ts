import { IsBoolean, IsNumber, IsString, MaxLength } from 'class-validator';

export class TaskCreateRequestDto {
    @IsString()
    @MaxLength(50)
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    workspaceId: number;

    @IsBoolean()
    completed: boolean;

    @IsNumber()
    position: number;
}
