import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { Request } from 'express';

export const ExtractUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const { userDb }: Request = ctx.switchToHttp().getRequest();

        return userDb;
    },
);
