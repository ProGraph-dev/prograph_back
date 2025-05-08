import { CookieModel } from '../models/cookie.model';
import { CurrentUserInteface } from './current-user.interface';

export interface ReqInterface extends Request {
  cookies: CookieModel;
  cookie: CookieModel;
  user: CurrentUserInteface;
  params: any;
  raw: any;
}
