import { IsNumber } from 'class-validator';

export class TaskUpdatePositionRequestDto {
    @IsNumber()
    id: number;

    @IsNumber()
    position: number;
}
