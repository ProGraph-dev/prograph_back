import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { BadRequestException } from '@nestjs/common/exceptions';
import { User } from 'src/modules/user/entity/user.entity';
export interface ReqInterface extends Request {
  user?: User;
}

export const CurrentUser = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<ReqInterface>();
    try {
      if (!req.user) {
        throw new BadRequestException('CurrentUser is undefined');
      }
      if (data) {
        return req.user[data];
      }
      return req.user;
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      throw {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Failed to save user',
      };
    }
  },
);
