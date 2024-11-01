import { IsNotEmpty, IsNumber } from 'class-validator';

export class TaskPositionUpdateDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsNumber()
    position: number;
}
