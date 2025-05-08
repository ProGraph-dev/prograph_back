import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { ResponseModel } from 'src/utils/models/response.model';
import { Achievement } from './entity/achievement.entity';
import { handlePostgresError } from 'src/utils/exceptions/postgres-error-handler.util';
import { assertFound } from 'src/utils/exceptions/all-exceptions.filter';

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
        throw new HttpException(
          `Achievement with ${title} title is exist`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const saveRes = await this._achievementRepo.save({
        title,
        count,
        is_active,
      });
      return { statusCode: HttpStatus.CREATED, response: saveRes };
    } catch (err) {
      handlePostgresError(err);
    }
  }

  public async update({
    id,
    title,
    count,
    is_active,
  }: DeepPartial<Achievement>): Promise<ResponseModel<Achievement>> {
    try {
      console.log(title);
      assertFound(
        await this._achievementRepo.exists({ where: { id } }),
        'Achievement with this id is not found',
      );

      if (
        await this._achievementRepo.exists({
          where: { title },
        })
      ) {
        throw new HttpException(
          'Achievement with same title is exist',
          HttpStatus.BAD_REQUEST,
        );
      }
      await this._achievementRepo.update({ id }, { count, title, is_active });
      const achievement = await this._achievementRepo.findOne({
        where: { id },
      });
      return { statusCode: HttpStatus.OK, response: achievement };
    } catch (err) {
      handlePostgresError(err);
    }
  }

  public async getById({
    id,
  }: DeepPartial<Achievement>): Promise<ResponseModel<Achievement>> {
    try {
      const getRes = assertFound(
        await this._achievementRepo.findOne({ where: { id } }),
        'Achievement whith that id is not found',
      );
      return { statusCode: HttpStatus.OK, response: getRes };
    } catch (err) {
      handlePostgresError(err);
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
      handlePostgresError(err);
    }
  }

  public async delete({
    id,
  }: DeepPartial<Achievement>): Promise<ResponseModel<null>> {
    try {
      assertFound(
        await this._achievementRepo.exists({ where: { id } }),
        'Achievement is not found',
      );
      const delRes = await this._achievementRepo.delete({ id });
      if (delRes.affected !== 0) {
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: 'Content successfully deleted',
        };
      } else {
        throw new HttpException('Somethink is wrong', HttpStatus.BAD_GATEWAY);
      }
    } catch (err) {
      handlePostgresError(err);
    }
  }
}
