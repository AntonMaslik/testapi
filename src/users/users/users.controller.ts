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
import { UserService } from './users.service';
import { UserEntity } from '../entity/user.entity';
import { UserUpdateRequestDto } from '../dto/user-update-request.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/auth/roles/roles/roles.enum';
import { AuthGuard } from 'src/decorators/guard.decorators';
import { SummaryInfo } from 'src/types/summary';

@AuthGuard()
@Controller('users')
export class UserController {
    constructor(private readonly UsersService: UserService) {}

    @Get('me')
    getMe() {}

    @Get(':id')
    getUserById() {}

    getUserByIdSummary() {}

    deleteUserById() {}

    @Put(':id')
    updateUserById() {}
}
