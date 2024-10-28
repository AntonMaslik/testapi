import { IsNumber, IsString, MaxLength } from "class-validator"

export class TaskUpdateRequestDto {
    
    @IsString()
    @MaxLength(50)
    public name: string;

    @IsString()
    public description: string;

    @IsNumber()
    public workspaceId: bigint;
}
