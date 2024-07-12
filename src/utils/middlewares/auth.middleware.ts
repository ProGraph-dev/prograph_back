import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
// import { User } from 'src/modules/user/entity/user.entity';
import { UserService } from 'src/modules/user/user.service';
import { ReqInterface } from '../interface/request.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly _userService: UserService) {}

  async use(req: ReqInterface, res: Response, next: NextFunction) {
    const token =
      req.cookies.access_token || req.headers['authorization']?.split(' ')[1];
    if (!token) {
      req.user = null;
      next();
      return;
    }
    try {
      const decoded = verify(token, process.env.JWT_SECRET) as { id: number };
      const userRes = await this._userService.getUserById({ id: decoded.id });
      if (userRes.statusCode === HttpStatus.OK) {
        req.user = userRes.response;
      } else {
        req.user = null;
      }
    } catch (error) {
      req.user = null;
    }
    next();
  }
}
