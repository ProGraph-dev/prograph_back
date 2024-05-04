import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private _authService: AuthService) {}

  @Post('/registration')
  private async registration(@Body() { email, password }) {
    try {
      const userRes = await this._authService.registreation({
        email,
        password,
      });
      if (userRes.statusCode == HttpStatus.CREATED) {
        return userRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Post('/login')
  private async Login() {
    try {
    } catch (err) {
      throw err;
    }
  }
}
