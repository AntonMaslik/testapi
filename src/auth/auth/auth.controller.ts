import {
  Body,
  Controller,
  Post,
  UseGuards,
  Header,
  Req
} from '@nestjs/common';
import { UserCreateRequestDto } from 'src/users/dto/user-create-request.dto';
import { AuthService } from './auth.service';
import { SignInDto } from '../dto/sign-in-dto';
import { RefreshTokenGuard } from '../guards/refreshToken.guard';
import { Request } from 'express';
import { UpdateResult } from 'typeorm';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() createUserDto: UserCreateRequestDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  signin(@Body() data: SignInDto) {
    return this.authService.signIn(data);
  }

  @UseGuards(RefreshTokenGuard)
  @Header('Authorization', null)
  @Post('logout')
  logout(@Req() req: Request): Promise<UpdateResult>{
    return this.authService.logout(req.user['sub'])
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refreshTokens(@Req() req: Request): Promise<{accessToken: string; refreshToken: string}> {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}