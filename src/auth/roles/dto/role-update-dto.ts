import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { RolesEntity } from '../entity/roles.entity';

export class roleUpdateDto {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsArray()
    @IsString({ each: true })
    roles: string[];
}
