import { ApiProperty } from '@nestjs/swagger';

import { IsBoolean, IsNumber, IsString, MaxLength } from 'class-validator';

export class TaskUpdateRequestDto {
    @ApiProperty()
    @IsString()
    public id: number;

    @ApiProperty()
    @IsString()
    @MaxLength(50)
    public name: string;

    @ApiProperty()
    @IsString()
    public description: string;

    @ApiProperty()
    @IsNumber()
    public workspaceId: number;

    @ApiProperty()
    @IsBoolean()
    public completed: boolean;

    @ApiProperty()
    @IsNumber()
    public position: number;
}
