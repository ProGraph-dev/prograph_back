import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRoleEnum } from '../enums/user-role.enum';
import { ReqInterface } from '../interface/request.interface';

@Injectable()
export class IsAdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest<ReqInterface>();
      let isAdmin;
      if (!request.raw.user) {
        throw new UnauthorizedException('User is unauthorized');
      }
      if (request.raw.user.userRole <= UserRoleEnum.ADMIN) {
        isAdmin = true;
      } else {
        isAdmin = false;
      }
      return isAdmin;
    } catch (err) {
      throw err;
    }
  }
}
