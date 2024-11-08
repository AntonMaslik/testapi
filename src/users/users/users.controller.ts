import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Put,
} from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { UserService } from './users.service';
import { UserEntity } from '../entity/user.entity';
import { UserUpdateRequestDto } from '../dto/user-update-request.dto';
import { AuthGuard } from 'src/decorators/guard.decorators';
import { SummaryInfo } from 'src/types/summary';
import { ExtractUser } from 'src/decorators/extractUser.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@AuthGuard()
@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
    constructor(private readonly UsersService: UserService) {}

    @Get('me')
    getMe(@ExtractUser() user: UserEntity): Promise<UserEntity> {
        return this.UsersService.getUserById(user, user.id);
    }

    @Get(':id')
    getUserById(
        @ExtractUser() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<UserEntity> {
        return this.UsersService.getUserById(user, id);
    }

    @Get('summary/:id')
    getUserByIdSummary(
        @ExtractUser() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<SummaryInfo> {
        return this.UsersService.getUserByIdSummary(user, id);
    }

    @Delete(':id')
    deleteUserById(
        @ExtractUser() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<UserEntity> {
        return this.UsersService.deleteUserById(user, id);
    }

    @Put(':id')
    updateUserById(
        @ExtractUser() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
        @Body() userUpdateRequestDto: UserUpdateRequestDto,
    ): Promise<UpdateResult> {
        return this.UsersService.updateUserById(user, id, userUpdateRequestDto);
    }
}
