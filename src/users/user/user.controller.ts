import { Body, Controller, Get, Param, Post, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from '../entity/user.entity';
import { UserCreateRequestDto } from '../dto/user-create-request.dto';
import { AuthGuard } from '@nestjs/passport';


@Controller('users')
export class UserController {
    constructor(private readonly UsersService: UserService) {}

    @Get()
    async getAllUsers(): Promise<UserEntity[]>
    {
        return this.UsersService.getAllUsers()
    }

    @Get(':id')
    async getUserById(@Param('id') id: string): Promise<UserEntity>{
        return this.UsersService.getUserById(Number(id))
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async createUser(@Body() user: UserCreateRequestDto){
        return this.UsersService.createUser(user);
    }

    @Delete(':id')
    async deleteById(@Param('id') id: string): Promise<UserEntity> {
        return this.UsersService.deleteById(Number(id));
    }
}
