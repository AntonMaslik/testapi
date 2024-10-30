<<<<<<< Updated upstream
import { Body, Controller, Get, Param, Post, Delete, UseGuards } from '@nestjs/common';
=======
import { Body, Controller, Get, Param, Post, Patch, UseGuards, Request, Req, Put} from '@nestjs/common';
>>>>>>> Stashed changes
import { UserService } from './user.service';
import { UserEntity } from '../entity/user.entity';
import { UserCreateRequestDto } from '../dto/user-create-request.dto';
import { AuthGuard } from '@nestjs/passport';


@Controller('users')
export class UserController {
    constructor(private readonly UsersService: UserService) {}

<<<<<<< Updated upstream
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
=======
    @UseGuards(RefreshTokenGuard )
    @Get('me')
    async getMe(@Request() request: any){
        return this.UsersService.getUserById(request.user.id);
    }
    
    @UseGuards(RefreshTokenGuard )
    @Put(':id')
    async getById(@Param('id') id: number, @Body() userUpdateDto: UserUpdateRequestDto): Promise<UserEntity>{
        return this.UsersService.updateUserById(id, userUpdateDto)
    }

>>>>>>> Stashed changes
}
