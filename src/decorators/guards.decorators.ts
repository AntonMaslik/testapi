import { UseGuards } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/auth/guards/refreshToken.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

export function AuthGuard() {
    return applyDecorators(UseGuards(AccessTokenGuard, RolesGuard));
}

export function RefreshGuard() {
    return applyDecorators(UseGuards(RefreshTokenGuard));
}
