import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/entity/user.entity';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private _authService: AuthService) {}

  @Post('/registration')
  private async registration(@Body() { email, password }: User) {
    try {
      const regRes = await this._authService.registreation({
        email,
        password,
      });
      if (regRes.statusCode == HttpStatus.CREATED) {
        return regRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Post('/login')
  private async Login(@Body() { email, password }: User, @Res() res: Response) {
    try {
      const loginRes = await this._authService.login({ email, password });
      if (loginRes.statusCode == HttpStatus.OK) {        
        res.cookie('access_token', loginRes.response.token, { httpOnly: true });        

        return res.status(HttpStatus.OK).send(loginRes);
      }      
    } catch (err) {
      throw err;
    }
  }

  @Post('/test')
  public async test(@CurrentUser() user: User) {
    return user;
  }
}
