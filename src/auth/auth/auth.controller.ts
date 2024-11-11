import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from '../dto/sign-in-dto';
import { AuthGuard } from 'src/decorators/guard.decorators';
import { Response } from 'express';
import { UpdateResult } from 'typeorm';
import { ExtractUser } from 'src/decorators/extractUser.decorator';
import { UserEntity } from 'src/users/entity/user.entity';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SignUpDto } from '../dto/sign-up-dto';

@Controller('auth')
@ApiBearerAuth()
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({ summary: 'Create user from sign up' })
    @Post('sign-up')
    async signUp(
        @Body() signUpDto: SignUpDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const tokens = await this.authService.signUp(signUpDto);

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

    @ApiOperation({ summary: 'Login user with email, password' })
    @Post('sign-in')
    async signIn(
        @Res({ passthrough: true }) res: Response,
        @Body() signInDto: SignInDto,
    ): Promise<{ accessToken }> {
        const tokens = await this.authService.signIn(signInDto);

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

    @ApiOperation({ summary: 'Logout user' })
    @ApiResponse({ status: 401, description: 'Not authoraztion' })
    @AuthGuard()
    @Post('logout')
    logout(
        @Res({ passthrough: true }) res: Response,
        @ExtractUser() user: any,
    ): Promise<UpdateResult> {
        res.clearCookie('refreshToken');

        return this.authService.logout(user.id);
    }

    @ApiOperation({ summary: 'Refresh token user' })
    @ApiResponse({ status: 401, description: 'Not authoraztion' })
    @AuthGuard()
    @Post('refresh')
    async refreshTokens(
        @ExtractUser() user: UserEntity,
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
