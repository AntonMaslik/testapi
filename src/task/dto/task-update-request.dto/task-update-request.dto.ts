import { IsBoolean, IsNumber, IsString, MaxLength } from "class-validator"

export class TaskUpdateRequestDto {
    @IsString()
    public uuid: string;

    @IsString()
    @MaxLength(50)
    public name: string;

    @IsString()
    public description: string;

    @IsNumber()
    public workspace_id: number;

    @IsBoolean()
    public completed: boolean;
}
