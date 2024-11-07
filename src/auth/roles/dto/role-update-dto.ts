import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class roleUpdateDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsArray()
    @IsString({ each: true })
    roles: string[];
}
