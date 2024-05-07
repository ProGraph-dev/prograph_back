import {
  BadGatewayException,
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profession } from './entity/profession.entity';
import { DeepPartial, Repository } from 'typeorm';
import { ResponseModel } from 'src/utils/models/response.model';

@Injectable()
export class ProfessionService {
  constructor(
    @InjectRepository(Profession)
    private _professionRepo: Repository<Profession>,
  ) {}

  public async save({
    title,
    description,
  }): Promise<ResponseModel<Profession>> {
    try {
      const exist = await this._professionRepo.exists({ where: { title } });
      if (!exist) {
        throw new BadRequestException(
          'Profession with title ${title} is exist',
        );
      }
      let profession = { title, description, users: [] } as Profession;
      profession = await this._professionRepo.save(profession);
      return { statusCode: HttpStatus.CREATED, response: profession };
    } catch (err) {
      throw err;
    }
  }

  public async update({
    id,
    title,
    description,
  }: DeepPartial<Profession>): Promise<ResponseModel<Profession>> {
    try {
      let profession = await this._professionRepo.findOne({ where: { id } });
      if (!profession) {
        throw new NotFoundException('Profession is not found');
      }
      if ((profession.title = title)) {
        throw new BadRequestException(
          `Profession with title ${title} is exist`,
        );
      }
      const updateData = await this._professionRepo.update(
        { id },
        { title, description },
      );
      if (updateData.raw !== 0) {
        profession = await this._professionRepo.findOne({ where: { id } });
        return { statusCode: HttpStatus.OK, response: profession };
      } else {
        throw new BadGatewayException('Somethink is wrong');
      }
    } catch (err) {
      throw err;
    }
  }

  public async getById({
    id,
  }: DeepPartial<Profession>): Promise<ResponseModel<Profession>> {
    try {
      const profession = await this._professionRepo.findOne({ where: { id } });
      if (profession == null) {
        throw new NotFoundException('Profession is not found');
      }
      return { statusCode: HttpStatus.OK, response: profession };
    } catch (err) {
      throw err;
    }
  }

  public async getLikeTitle(
    { title }: DeepPartial<Profession>,
    skip: number,
    take: number,
  ): Promise<ResponseModel<{ list: Profession[]; count: number }>> {
    try {
      const [list, count] = await this._professionRepo
        .createQueryBuilder('repo')
        .andWhere('repo.title  LIKE :title', { title })
        .skip(skip)
        .take(take)
        .getManyAndCount();
      return { statusCode: HttpStatus.OK, response: { list, count } };
    } catch (err) {
      throw err;
    }
  }

  public async getList(
    skip: number,
    take: number,
  ): Promise<ResponseModel<{ list: Profession[]; count: number }>> {
    try {
      const [list, count] = await this._professionRepo.findAndCount({
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
  }: DeepPartial<Profession>): Promise<ResponseModel<undefined>> {
    try {
      const exists = await this._professionRepo.exists({ where: { id } });
      if (!exists) {
        throw new NotFoundException('Profession is not found');
      }
      const reqData = await this._professionRepo.delete({ id });
      if (reqData.raw !== 0) {
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: 'Data successfully deleted',
        };
      } else {
        throw new BadGatewayException('Something is wrong');
      }
    } catch (err) {
      throw err;
    }
  }
}
