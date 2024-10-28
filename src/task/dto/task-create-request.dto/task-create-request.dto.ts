import { IsBoolean, IsNumber, IsString, MaxLength } from "class-validator"

export class TaskCreateRequestDto {

    @IsString()
    @MaxLength(50)
    public name: string;

    @IsString()
    public description: string;

    @IsNumber()
    public workspace_id: bigint;

    @IsBoolean()
    public completed: boolean;
}
