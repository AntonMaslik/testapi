import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { SignInDto } from '../dto/sign-in-dto';
import { AuthGuard, RefreshGuard } from 'src/decorators/guards.decorators';
import { SignUpDto } from '../dto/sign-up-dto';
import { COOKIE_OPTIONS } from 'src/config/cookie-options.config';
import { ExtractUser } from 'src/decorators/extractUser.decorator';

import { UserEntity } from 'src/users/entity/user.entity';

import {
    ApiBearerAuth,
    ApiOperation,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('auth')
@ApiBearerAuth()
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({ summary: 'Create user from sign up' })
    @Post('sign-up')
    async signUp(
        @Body() signUpDto: SignUpDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<{ accessToken }> {
        const { accessToken, refreshToken } =
            await this.authService.signUp(signUpDto);

        res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

        return { accessToken };
    }

    @ApiOperation({ summary: 'Login user with email, password' })
    @Post('sign-in')
    async signIn(
        @Res({ passthrough: true }) res: Response,
        @Body() signInDto: SignInDto,
    ): Promise<{ accessToken }> {
        const { accessToken, refreshToken } =
            await this.authService.signIn(signInDto);

        res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

        return { accessToken };
    }

    @ApiOperation({ summary: 'Logout user' })
    @ApiUnauthorizedResponse({ description: 'Not authorization' })
    @AuthGuard()
    @Post('logout')
    logout(
        @Res({ passthrough: true }) res: Response,
        @Req() req: Request,
        @ExtractUser()
        user: UserEntity,
    ): Promise<Boolean> {
        const currentRefreshToken = req.cookies.refreshToken;

        res.clearCookie('refreshToken');

        return this.authService.logout(user.id, currentRefreshToken);
    }

    @ApiOperation({ summary: 'Refresh token user' })
    @ApiUnauthorizedResponse({ description: 'Not authorization' })
    @RefreshGuard()
    @Post('refresh')
    async refreshTokens(
        @ExtractUser() user: UserEntity,
        @Res({ passthrough: true }) res: Response,
        @Req() req: Request,
    ): Promise<{ accessToken }> {
        const { accessToken, refreshToken } =
            await this.authService.refreshTokens(
                user,
                req.cookies.refreshToken,
            );

        res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

        return { accessToken };
    }

    @ApiOperation({ summary: 'Logout all sessions exception to current' })
    @ApiUnauthorizedResponse({ description: 'Not authorization' })
    @RefreshGuard()
    @Post('logout-all-sessions')
    async invalidateAllTokensWithException(
        @ExtractUser() user: UserEntity,
        @Req() req: Request,
    ): Promise<Boolean> {
        const currentRefreshToken = req.cookies.refreshToken;

        return this.authService.invalidateAllTokensWithException(
            user.id,
            currentRefreshToken,
        );
    }
}
