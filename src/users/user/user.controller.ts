import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from '../entity/user.entity';
import { UserUpdateRequestDto } from '../dto/user-update-request.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/auth/roles/roles.enum';
import { AuthGuard } from 'src/decorators/guard.decorators';
import { SummaryInfo } from 'src/types/summary';

@AuthGuard()
@Controller('users')
export class UserController {
    constructor(private readonly UsersService: UserService) {}

    @Roles(Role.ADMIN)
    @Get('admin/all')
    async getAllUsers(): Promise<UserEntity[]> {
        return this.UsersService.getAllUsers();
    }

    @Roles(Role.USER)
    @Get('me')
    async getMe(@Request() request: any) {
        return this.UsersService.getUserById(request.user.id);
    }

    @Roles(Role.ADMIN)
    @Get('admin/:id')
    async getById(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
        return this.UsersService.getUserById(id);
    }

    @Roles(Role.ADMIN)
    @Patch('admin/:id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UserUpdateRequestDto,
    ): Promise<UserEntity> {
        return this.UsersService.updateUserById(id, updateUserDto);
    }

    @Roles(Role.ADMIN)
    @Delete('admin/:id')
    async deleteUserById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<UserEntity> {
        return this.UsersService.deleteUserById(id);
    }

    @Roles(Role.ADMIN)
    @Get('admin/summary/:id')
    async getSummaryUserById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<SummaryInfo> {
        return this.UsersService.getSummaryByUserId(id);
    }
}
