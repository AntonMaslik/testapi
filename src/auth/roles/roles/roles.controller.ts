import { Body, Controller, Post } from '@nestjs/common';
import { roleUpdateDto } from '../dto/role-update-dto';
import { RolesService } from './roles.service';
import { AuthGuard } from 'src/decorators/guard.decorators';
import { ExtractUser } from 'src/decorators/extractUser.decorator';
import { UserEntity } from 'src/users/entity/user.entity';

@AuthGuard()
@Controller('auth')
export class RolesController {
    constructor(private rolesService: RolesService) {}

    @Post('assign-role')
    async assignRole(
        @ExtractUser() user: UserEntity,
        @Body() roleUpdateDto: roleUpdateDto,
    ) {
        return this.rolesService.updateRoleByIdUser(user, roleUpdateDto);
    }
}
