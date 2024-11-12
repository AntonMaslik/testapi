import { ConfigService, registerAs } from '@nestjs/config';

const configService = new ConfigService();

export default registerAs('jwt', () => ({
    accessSecret: configService.getOrThrow('JWT_ACCESS_SECRET'),
    refreshSecret: configService.getOrThrow('JWT_REFRESH_SECRET'),
    accessTokenExpiration: '7d',
    refreshTokenExpiration: '7d',
}));
