import { Body, Controller, Post, UseGuards, Req, Res } from '@nestjs/common';
import { UserCreateRequestDto } from 'src/users/dto/user-create-request.dto';
import { AuthService } from './auth.service';
import { SignInDto } from '../dto/sign-in-dto';
import { RefreshTokenGuard } from '../guards/refreshToken.guard';
import { Request, Response } from 'express';
import { UpdateResult } from 'typeorm';
import { ExtractUser } from 'src/decorators/extractUser.decorator';
import { UserEntity } from 'src/users/entity/user.entity';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    async signup(
        @Body() createUserDto: UserCreateRequestDto,
        @Res() res: Response,
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
    async signin(@Body() data: SignInDto, @Res() res: Response) {
        const tokens = await this.authService.signIn(data);

        res.cookie('refreshToken', tokens.refreshToken, {
            maxAge: 1000 * 60 * 15,
            httpOnly: true,
            secure: false,
            signed: false,
        });

        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }

    @UseGuards(RefreshTokenGuard)
    @Post('logout')
    logout(
        @Res() res: Response,
        @ExtractUser() user: any,
    ): Promise<UpdateResult> {
        res.clearCookie('refreshToken');

        return this.authService.logout(user.id);
    }

    @UseGuards(RefreshTokenGuard)
    @Post('refresh')
    async refreshTokens(
        @ExtractUser() user: any,
        @Res() res: Response,
    ): Promise<{ accessToken; refreshToken }> {
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
            refreshToken: tokens.refreshToken,
        };
    }
}
