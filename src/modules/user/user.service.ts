import {
  BadGatewayException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { DeepPartial, Repository } from 'typeorm';
import { ResponseModel } from 'src/utils/models/response.model';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private _userRepo: Repository<User>) {}

  public async update(
    { id },
    data: DeepPartial<User>,
  ): Promise<ResponseModel<User>> {
    try {
      const exist = await this._userRepo.exists({ where: { id: data.id } });
      if (!exist) {
        throw new NotFoundException('User is not found');
      }
      await this._userRepo.update({ id }, data);
      const user = await this._userRepo.findOne({ where: { id } });
      return { statusCode: HttpStatus.OK, response: user };
    } catch (err) {
      throw err;
    }
  }

  public async getUserById({
    id,
  }: DeepPartial<User>): Promise<ResponseModel<User>> {
    try {
      const exist = await this._userRepo.exists({ where: { id } });
      if (!exist) {
        throw new NotFoundException('User is not found');
      }
      const user = await this._userRepo.findOne({ where: { id } });
      return { statusCode: HttpStatus.OK, response: user };
    } catch (err) {
      throw err;
    }
  }

  public async getUserList(
    skip: number,
    take: number,
    criteries,
  ): Promise<ResponseModel<{ list: User[]; count: number }>> {
    try {
      const [list, count] = await this._userRepo.findAndCount({
        where: [criteries],
        skip,
        take,
      });
      return { statusCode: HttpStatus.OK, response: { list, count } };
    } catch (err) {
      throw err;
    }
  }

  public async delete({ id }: DeepPartial<User>): Promise<ResponseModel<null>> {
    try {
      const exist = await this._userRepo.exists({ where: { id } });
      if (!exist) {
        throw new NotFoundException('User is not found');
      }
      const delRes = await this._userRepo.delete({ id });
      if (delRes.raw !== 0) {
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: 'Data successfully Deleted',
        };
      }
      throw new BadGatewayException('Something is wrong');
    } catch (err) {
      throw err;
    }
  }
}
