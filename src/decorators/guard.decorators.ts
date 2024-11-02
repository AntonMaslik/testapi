import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { applyDecorators } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';

export function AuthGuard() {
    return applyDecorators(UseGuards(RolesGuard, AccessTokenGuard));
}
