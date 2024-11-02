import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { RolesEntity } from '../roles.entity';

export class roleUpdateDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsArray()
    @IsNotEmpty()
    roles: RolesEntity[];
}
