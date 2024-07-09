import { User } from 'src/modules/user/entity/user.entity';
import { CookieModel } from '../models/cookie.model';

export interface ReqInterface extends Request {
  cookies: CookieModel;
  cookie: CookieModel;
  user: User;
}
