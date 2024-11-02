import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Request,
    Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from '../entity/user.entity';
import { UserUpdateRequestDto } from '../dto/user-update-request.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/auth/roles/roles.enum';
import { AuthGuard } from 'src/decorators/guard.decorators';

@AuthGuard()
@Controller('users')
export class UserController {
    constructor(private readonly UsersService: UserService) {}

    @Roles(Role.ADMIN)
    @Get()
    async getAllUsers(): Promise<UserEntity[]> {
        return this.UsersService.getAllUsers();
    }

    @Roles(Role.USER)
    @Get('me')
    async getMe(@Request() request: any) {
        return this.UsersService.getUserById(request.user.id);
    }

    @Roles(Role.USER)
    @Get(':id')
    async getById(@Param('id') id: number): Promise<UserEntity> {
        return this.UsersService.getUserById(id);
    }

    @Roles(Role.USER)
    @Patch(':id')
    async update(
        @Param('id') id: number,
        @Body() updateUserDto: UserUpdateRequestDto,
    ): Promise<UserEntity> {
        return this.UsersService.updateUserById(id, updateUserDto);
    }
}
