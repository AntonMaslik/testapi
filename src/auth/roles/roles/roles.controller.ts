import { Body, Controller, Post } from '@nestjs/common';
import { roleUpdateDto } from '../dto/role-update-dto';
import { RolesService } from './roles.service';
import { AuthGuard } from 'src/decorators/guard.decorators';
import { ExtractUser } from 'src/decorators/extractUser.decorator';
import { UserEntity } from 'src/users/entity/user.entity';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

@AuthGuard()
@ApiTags('Roles')
@ApiBearerAuth()
@Controller('auth')
export class RolesController {
    constructor(private rolesService: RolesService) {}

    @ApiOperation({ summary: 'Update role user by id (for Admin)' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @Post('assign-role')
    async assignRole(
        @ExtractUser() user: UserEntity,
        @Body() roleUpdateDto: roleUpdateDto,
    ): Promise<UserEntity> {
        return this.rolesService.updateRoleByIdUser(user, roleUpdateDto);
    }
}
