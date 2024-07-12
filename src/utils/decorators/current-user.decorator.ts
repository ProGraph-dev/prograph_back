import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { ReqInterface } from '../interface/request.interface';

export const CurrentUser = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<ReqInterface>();
    try {
      if (!req.raw.user) {
        throw new UnauthorizedException('CurrentUser is undefined');
      }
      return req.raw.user;
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Failed to save user',
      };
    }
  },
);
