import {
  BadGatewayException,
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { ResponseModel } from 'src/utils/models/response.model';
import { Achievement } from './entity/achievement.entity';

@Injectable()
export class AchievementService {
  constructor(
    @InjectRepository(Achievement)
    private _achievementRepo: Repository<Achievement>,
  ) {}

  public async save({
    title,
    count,
    is_active,
  }: DeepPartial<Achievement>): Promise<ResponseModel<Achievement>> {
    try {
      const exists = await this._achievementRepo.exists({ where: { title } });
      if (exists) {
        throw new BadRequestException(
          `Achievement with ${title} title is exist`,
        );
      }
      const saveRes = await this._achievementRepo.save({
        title,
        count,
        is_active,
      });
      return { statusCode: HttpStatus.CREATED, response: saveRes };
    } catch (err) {
      throw err;
    }
  }

  public async update({
    id,
    title,
    count,
    is_active,
  }: DeepPartial<Achievement>): Promise<ResponseModel<Achievement>> {
    try {
      const existsId = await this._achievementRepo.exists({ where: { id } });
      if (!existsId) {
        throw new NotFoundException('Achievement with this id is not found');
      }
      const existsTitle = await this._achievementRepo.exists({
        where: { title },
      });
      if (existsTitle) {
        throw new BadRequestException('Achievement with same title is exist');
      }
      await this._achievementRepo.update({ id }, { count, title, is_active });
      const achievement = await this._achievementRepo.findOne({
        where: { id },
      });
      return { statusCode: HttpStatus.OK, response: achievement };
    } catch (err) {
      throw err;
    }
  }

  public async getById({
    id,
  }: DeepPartial<Achievement>): Promise<ResponseModel<Achievement>> {
    try {
      const getRes = await this._achievementRepo.findOne({ where: { id } });
      if (!getRes) {
        throw new NotFoundException('Achievement whith that id is not found');
      }
      return { statusCode: HttpStatus.OK, response: getRes };
    } catch (err) {
      throw err;
    }
  }

  public async getList(
    is_active: boolean,
    skip: number,
    take: number,
  ): Promise<ResponseModel<{ list: Achievement[]; count: number }>> {
    try {
      const [list, count] = await this._achievementRepo.findAndCount({
        where: {
          is_active,
        },
        skip,
        take,
      });
      return { statusCode: HttpStatus.OK, response: { list, count } };
    } catch (err) {
      throw err;
    }
  }

  public async delete({
    id,
  }: DeepPartial<Achievement>): Promise<ResponseModel<null>> {
    try {
      const exists = await this._achievementRepo.exists({ where: { id } });
      if (!exists) {
        throw new NotFoundException('Achievement is not found');
      }
      const delRes = await this._achievementRepo.delete({ id });
      if (delRes.affected !== 0) {
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: 'Content successfully deleted',
        };
      } else {
        throw new BadGatewayException('Somethink is wrong');
      }
    } catch (err) {
      throw err;
    }
  }
}
