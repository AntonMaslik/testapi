import {
    Body,
    Controller,
    Post,
    UseGuards,
    Header,
    Req,
    Res,
} from '@nestjs/common';
import { UserCreateRequestDto } from 'src/users/dto/user-create-request.dto';
import { AuthService } from './auth.service';
import { SignInDto } from '../dto/sign-in-dto';
import { RefreshTokenGuard } from '../guards/refreshToken.guard';
import { Request, Response } from 'express';
import { UpdateResult } from 'typeorm';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    async signup(
        @Body() createUserDto: UserCreateRequestDto,
        @Res() res: Response,
    ) {
        const tokens = await this.authService.signUp(createUserDto);

        /// TODO: Добавить в sign-in
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
    signin(@Body() data: SignInDto) {
        return this.authService.signIn(data);
    }

    @UseGuards(RefreshTokenGuard)
    @Post('logout')
    logout(@Req() req: Request, @Res() res: Response): Promise<UpdateResult> {
        res.clearCookie('refreshToken');
        return this.authService.logout(req.user['sub']);
    }

    @UseGuards(RefreshTokenGuard)
    @Post('refresh')
    refreshTokens(
        @Req() req: Request,
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const userId = req.user['sub'];
        const refreshToken = req.user['refreshToken'];
        return this.authService.refreshTokens(userId, refreshToken);
    }
}
