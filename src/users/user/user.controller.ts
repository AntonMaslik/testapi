import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    UseGuards,
    Request,
    Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from '../entity/user.entity';
import { UserUpdateRequestDto } from '../dto/user-update-request.dto';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';

@Controller('users')
export class UserController {
    constructor(private readonly UsersService: UserService) {}

    @UseGuards(AccessTokenGuard)
    @Get()
    async getAllUsers(@Req() req): Promise<UserEntity[]> {
        console.log(req.userDb);
        return this.UsersService.getAllUsers();
    }

    @UseGuards(AccessTokenGuard)
    @Get('me')
    async getMe(@Request() request: any) {
        return this.UsersService.getUserById(request.user.id);
    }

    @UseGuards(AccessTokenGuard)
    @Get(':id')
    async getById(@Param('id') id: number): Promise<UserEntity> {
        return this.UsersService.getUserById(id);
    }

    @UseGuards(AccessTokenGuard)
    @Patch(':id')
    async update(
        @Param('id') id: number,
        @Body() updateUserDto: UserUpdateRequestDto,
    ): Promise<UserEntity> {
        return this.UsersService.updateUserById(id, updateUserDto);
    }
}
