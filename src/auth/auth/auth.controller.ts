import { Body, Controller, Post, UseGuards, Res } from '@nestjs/common';
import { UserCreateRequestDto } from 'src/users/dto/user-create-request.dto';
import { AuthService } from './auth.service';
import { SignInDto } from '../dto/sign-in-dto';
import { RefreshTokenGuard as AccessTokenGuard } from '../guards/refreshToken.guard';
import { Response } from 'express';
import { UpdateResult } from 'typeorm';
import { ExtractUser } from 'src/decorators/extractUser.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    async signup(
        @Body() createUserDto: UserCreateRequestDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const tokens = await this.authService.signUp(createUserDto);

        res.cookie('refreshToken', tokens.refreshToken, {
            maxAge: 1000 * 60 * 15,
            httpOnly: true,
            secure: false,
            signed: false,
        });

        return {
            accessToken: tokens.accessToken,
        };
    }

    @Post('signin')
    async signin(
        @Res({ passthrough: true }) res: Response,
        @Body() data: SignInDto,
    ): Promise<{ accessToken }> {
        const tokens = await this.authService.signIn(data);

        res.cookie('refreshToken', tokens.refreshToken, {
            maxAge: 1000 * 60 * 15,
            httpOnly: true,
            secure: false,
            signed: false,
        });

        return {
            accessToken: tokens.accessToken,
        };
    }

    @UseGuards(AccessTokenGuard)
    @Post('logout')
    logout(
        @Res({ passthrough: true }) res: Response,
        @ExtractUser() user: any,
    ): Promise<UpdateResult> {
        res.clearCookie('refreshToken');

        return this.authService.logout(user.id);
    }

    @UseGuards(AccessTokenGuard)
    @Post('refresh')
    async refreshTokens(
        @ExtractUser() user: any,
        @Res({ passthrough: true }) res: Response,
    ): Promise<{ accessToken }> {
        const tokens = await this.authService.refreshTokens(
            user.id,
            user.refreshToken,
        );

        res.cookie('refreshToken', tokens.refreshToken, {
            maxAge: 1000 * 60 * 15,
            httpOnly: true,
            secure: false,
            signed: false,
        });

        return {
            accessToken: tokens.accessToken,
        };
    }
}
