import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class TaskUpdatePositionRequestDto {
    @ApiProperty()
    @IsNumber()
    id: number;

    @ApiProperty()
    @IsNumber()
    position: number;
}
