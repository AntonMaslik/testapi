import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity//user.entity';
import { RolesEntity } from 'src/auth/roles/roles.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, RolesEntity])],
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {}
