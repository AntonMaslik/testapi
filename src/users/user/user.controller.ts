import { Body, Controller, Get, Param, Post, Delete, UseGuards, Request, Put} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from '../entity/user.entity';
import { UserCreateRequestDto } from '../dto/user-create-request.dto';
import { AuthGuard } from '@nestjs/passport';
import { HttpException, HttpStatus } from '@nestjs/common';
import { request } from 'http';



@Controller('users')
export class UserController {
    constructor(private readonly UsersService: UserService) {}

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getAllUsers(@Request() request): Promise<UserEntity[]>
    {   
        if(await this.UsersService.IsAdmin(request.user.id) == true)
            return this.UsersService.getAllUsers()
        else
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async getMe(@Request() request: any){
        return this.UsersService.getUserById(request.user.id);
    }
    
    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async getUserById(@Param('id') id: number, @Request() request: any): Promise<UserEntity>{
        if(await this.UsersService.IsAdmin(request.user.id) == true)
            return this.UsersService.getUserById(id)
        else
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async createUser(@Body() user: UserCreateRequestDto){
        return this.UsersService.createUser(user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async deleteById(@Request() request, @Param('id') id: number): Promise<UserEntity> {
        if(await this.UsersService.IsAdmin(request.user.id) == true)
            return this.UsersService.deleteById(Number(id));
        else
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('setAdmin')
    async setAdmin(@Request() request: any): Promise<boolean>{
        if(this.UsersService.IsAdmin(request.user.id))
            return this.UsersService.setAdmin(request.user.id)
        else
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('setNotAdmin')
    async setNotAdmin(@Request() request: any): Promise<boolean>{
        if(request.user.admin)
            return this.UsersService.setNotAdmin(request.user.id)
        else
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    
}
