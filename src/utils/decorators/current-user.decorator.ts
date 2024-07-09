import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { ReqInterface } from '../interface/request.interface';

export const CurrentUser = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<ReqInterface>();
    try {
      console.log(req);
      if (!req.user) {
        throw new UnauthorizedException('CurrentUser is undefined');
      }
      if (data) {
        return req.user[data];
      }
      return req.user;
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
