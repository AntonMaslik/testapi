import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { Request } from 'express';

export const ExtractUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const { user }: Request = ctx.switchToHttp().getRequest();

        return user['userDb'];
    },
);
