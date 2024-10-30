import { Body, Controller, Get, Param, Post, Delete, UseGuards, Request, Put, applyDecorators} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from '../entity/user.entity';
import { UserCreateRequestDto } from '../dto/user-create-request.dto';
import { AuthGuard } from '@nestjs/passport';
import { HttpException, HttpStatus } from '@nestjs/common';
import { request } from 'http';

const JwtGuard = () => applyDecorators(UseGuards(AuthGuard('jwt')))

@Controller('users')
export class UserController {
    constructor(private readonly UsersService: UserService) {}

    @JwtGuard()
    @Get()
    async getAllUsers(@Request() request): Promise<UserEntity[]>
    {   
        return this.UsersService.getAllUsers()
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async getMe(@Request() request: any){
        return this.UsersService.getUserById(request.user.id);
    }
    
    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async getUserById(@Param('id') id: number, @Request() request: any): Promise<UserEntity>{
        return this.UsersService.getUserById(id)
    }
}
