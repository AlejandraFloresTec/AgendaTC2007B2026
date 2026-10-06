/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JWTPayload } from './jwt';

export const CurrentUser = createParamDecorator(
    (_data: unknown, context: ExecutionContext): JWTPayload => {
        return context.switchToHttp().getRequest().user;
    },
);