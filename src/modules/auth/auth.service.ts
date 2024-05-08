import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
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
      const jwt = sign(
        { id: user.id, userRole: user.userRole },
        process.env.JWT_SECRET,
      );
      return {
        statusCode: HttpStatus.CREATED,
        response: { token: jwt, user: user },
      };
    } catch (err) {
      throw err;
    }
  }

  public async login({
    email,
    password,
  }: DeepPartial<User>): Promise<ResponseModel<{ token: string; user: User }>> {
    try {
      let user = await this._userRepo.findOne({
        where: { email },
        select: { id: true, email: true, password: true },
      });
      if (user == null) {
        throw new BadRequestException('Something is wrong');
      }
      const compare = bcrypt.compare(password, user.password);
      if (!compare) {
        throw new BadRequestException('Something is wrong');
      }
      user = await this._userRepo.findOne({ where: { id: user.id } });
      const jwt = sign(
        { id: user.id, userRole: user.userRole },
        process.env.JWT_SECRET,
      );
      return {
        statusCode: HttpStatus.OK,
        response: { token: jwt, user: user },
      };
    } catch (err) {
      throw err;
    }
  }
}
