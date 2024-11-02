import { Body, Controller, Post } from '@nestjs/common';
import { roleUpdateDto } from './dto/role-update-dto';
import { RolesService } from './roles.service';
import { AuthGuard } from 'src/decorators/guard.decorators';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from './roles.enum';

@AuthGuard()
@Controller('auth')
export class RolesController {
    constructor(private rolesService: RolesService) {}

    @Roles(Role.ADMIN)
    @Post('assign-role')
    async assignRole(@Body() roleUpdateDto: roleUpdateDto) {
        return this.rolesService.updateRoleByIdUser(roleUpdateDto);
    }
}
