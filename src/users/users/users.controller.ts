import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Put,
} from '@nestjs/common';

import {
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

import { UpdateResult } from 'typeorm';
import { UserService } from './users.service';

import { UserEntity } from '../entity/user.entity';

import { UserUpdateRequestDto } from '../dto/user-update-request.dto';

import { SummaryInfo } from 'src/types/summary';

import { ExtractUser } from 'src/decorators/extractUser.decorator';
import { AuthGuard } from 'src/decorators/guards.decorators';

import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/auth/roles/roles/roles.enum';

@AuthGuard()
@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
    constructor(private readonly UsersService: UserService) {}

    @ApiOperation({ summary: 'Get me' })
    @ApiForbiddenResponse({ description: 'Not authorization' })
    @ApiNotFoundResponse({ description: 'Not found user' })
    @ApiResponse({
        status: 200,
        description: 'The found user',
        type: UserEntity,
    })
    @Get('me')
    getMe(@ExtractUser() user: UserEntity): Promise<UserEntity> {
        return this.UsersService.getUserById(user, user.id);
    }

    @ApiOperation({ summary: 'Get user by id' })
    @ApiForbiddenResponse({ description: 'Not authorization' })
    @ApiNotFoundResponse({ description: 'Not found user' })
    @ApiResponse({
        status: 200,
        description: 'The found user',
        type: UserEntity,
    })
    @Get(':id')
    getUserById(
        @ExtractUser() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<UserEntity> {
        return this.UsersService.getUserById(user, id);
    }

    @ApiOperation({ summary: 'Get info summary by user' })
    @ApiForbiddenResponse({ description: 'Not authorization' })
    @ApiNotFoundResponse({ description: 'Not found user' })
    @ApiResponse({
        status: 200,
        description: 'The found summary from user',
    })
    @Roles(Role.ADMIN)
    @Get('summary/:id')
    getUserByIdSummary(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<SummaryInfo> {
        return this.UsersService.getUserByIdSummary(id);
    }

    @ApiOperation({ summary: 'Delete user by id' })
    @ApiForbiddenResponse({ description: 'Not authorization' })
    @ApiNotFoundResponse({ description: 'Not found user' })
    @ApiResponse({
        status: 200,
        description: 'The user deleted',
        type: UserEntity,
    })
    @Roles(Role.ADMIN)
    @Delete(':id')
    deleteUserById(
        @ExtractUser() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<UserEntity> {
        return this.UsersService.deleteUserById(user, id);
    }

    @ApiOperation({ summary: 'Update user by id' })
    @ApiForbiddenResponse({ description: 'Not authorization' })
    @ApiNotFoundResponse({ description: 'Not found user' })
    @ApiResponse({
        status: 200,
        description: 'The user updated!',
        type: UpdateResult,
    })
    @Put(':id')
    updateUserById(
        @ExtractUser() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
        @Body() userUpdateRequestDto: UserUpdateRequestDto,
    ): Promise<UpdateResult> {
        return this.UsersService.updateUserById(user, id, userUpdateRequestDto);
    }
}
