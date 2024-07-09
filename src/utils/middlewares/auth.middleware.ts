import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { User } from 'src/modules/user/entity/user.entity';
import { UserService } from 'src/modules/user/user.service';
import { ReqInterface } from '../interface/request.interface';

@Injectable()
export class AuthMiddleWare implements NestMiddleware {
  constructor(private readonly _userService: UserService) {}
  async use(req: ReqInterface, res: Response, next: NextFunction) {
    if (!req.headers['authorization'] && !req.cookies.access_token) {
      req.user = null;
      next();
      return;
    }
    const token = req.cookies.access_token
      ? req.cookies.access_token
      : req.headers['authorization'].split(' ')[1];
    try {
      const decode = verify(token, process.env.JWT_SECRET) as User;
      const userRes = await this._userService.getUserById({ id: +decode.id });
      if (userRes.statusCode == HttpStatus.OK) {
        req.user = userRes.response;
      }
      next();
    } catch (error) {
      req.user = null;
      next();
    }
  }
}
