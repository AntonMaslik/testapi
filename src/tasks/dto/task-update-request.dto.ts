import { IsBoolean, IsNumber, IsString, MaxLength } from 'class-validator';

export class TaskUpdateRequestDto {
    @IsString()
    public id: number;

    @IsString()
    @MaxLength(50)
    public name: string;

    @IsString()
    public description: string;

    @IsNumber()
    public workspaceId: number;

    @IsBoolean()
    public completed: boolean;

    @IsNumber()
    public position: number;
}
