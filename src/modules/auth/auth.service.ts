import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entity/user.entity';
import { RegUserInterface } from './models/interface/reg-user.interface';
import { ResponseModel } from 'src/utils/models/response.model';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private _userRepo: Repository<User>) {}

  public async registreation({
    email,
    password,
  }: RegUserInterface): Promise<ResponseModel<{ token: string; user: User }>> {
    try {
      const existuser = await this._userRepo.findOne({ where: { email } });
      if (existuser) {
        throw new BadRequestException('Email address is already taken');
      }
      const salt = await bcrypt.genSalt(+process.env.HASH_ROUND);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await this._userRepo.save({
        email,
        password: hashedPassword,
      });
      const jwt = sign({ id: user.id }, process.env.JWT_SECRET);
      return {
        statusCode: HttpStatus.CREATED,
        response: { token: jwt, user: user },
      };
    } catch (err) {
      throw err;
    }
  }
}
