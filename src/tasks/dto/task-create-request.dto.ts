import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString, MaxLength } from 'class-validator';

export class TaskCreateRequestDto {
    @ApiProperty()
    @IsString()
    @MaxLength(50)
    name: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsNumber()
    workspaceId: number;

    @ApiProperty()
    @IsBoolean()
    completed: boolean;

    @ApiProperty()
    @IsNumber()
    position: number;
}
