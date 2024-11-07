import { UseGuards } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';

export function AuthGuard() {
    return applyDecorators(UseGuards(AccessTokenGuard));
}
