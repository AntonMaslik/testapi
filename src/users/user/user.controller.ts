import { Body, Controller, Get, Param, Post, Patch, UseGuards, Request, Req} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from '../entity/user.entity';
import { UserUpdateRequestDto } from '../dto/user-update-request.dto';
import { RefreshTokenGuard } from 'src/auth/guards/refreshToken.guard';

@Controller('users')
export class UserController {
    constructor(private readonly UsersService: UserService) {}

    @UseGuards(RefreshTokenGuard )
    @Get()
    async getAllUsers(@Req() req): Promise<UserEntity[]>
    {   
        return this.UsersService.getAllUsers()
    }

    @UseGuards(RefreshTokenGuard )
    @Get('me')
    async getMe(@Request() request: any){
        return this.UsersService.getUserById(request.user.id);
    }
    
    @UseGuards(RefreshTokenGuard )
    @Get(':id')
    async getById(@Param('id') id: number): Promise<UserEntity>{
        return this.UsersService.getUserById(id)
    }

    @UseGuards(RefreshTokenGuard)
    @Patch(':id')
    async update(@Param('id') id: number, @Body() updateUserDto: UserUpdateRequestDto): Promise<UserEntity>{
        return this.UsersService.updateUserById(id, updateUserDto)
    }
}
