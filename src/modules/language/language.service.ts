import {
  BadGatewayException,
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Language } from './entity/language.entity';
import { DeepPartial, Repository } from 'typeorm';
import { ResponseModel } from 'src/utils/models/response.model';

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(Language) private _languageRepo: Repository<Language>,
  ) {}

  public async save({
    ISO,
    path,
    title,
  }: DeepPartial<Language>): Promise<ResponseModel<Language>> {
    try {
      const exist = await this._languageRepo.exists({ where: { ISO } });
      if (exist) {
        throw new BadRequestException('Language already exist');
      }
      const saveRes = await this._languageRepo.save({ ISO, path, title });
      return { statusCode: HttpStatus.CREATED, response: saveRes };
    } catch (err) {
      throw err;
    }
  }

  public async update({
    id,
    ISO,
    path,
    title,
  }: DeepPartial<Language>): Promise<ResponseModel<Language>> {
    try {
      const exists = await this._languageRepo.exists({ where: { ISO } });
      if (exists) {
        throw new BadRequestException('Language already exist');
      }
      const updateRes = await this._languageRepo.update(
        { id },
        { ISO, path, title },
      );
      if (updateRes.raw !== 0) {
        const getRes = await this._languageRepo.findOne({ where: { id } });
        return { statusCode: HttpStatus.OK, response: getRes };
      }
    } catch (err) {
      throw err;
    }
  }

  public async getByISO({
    ISO,
  }: DeepPartial<Language>): Promise<ResponseModel<Language>> {
    try {
      const getRes = await this._languageRepo.findOne({ where: { ISO } });
      if (getRes == null) {
        throw new NotFoundException('Language not found');
      }
      return { statusCode: HttpStatus.OK, response: getRes };
    } catch (err) {
      throw err;
    }
  }

  public async getById({
    id,
  }: DeepPartial<Language>): Promise<ResponseModel<Language>> {
    try {
      const getRes = await this._languageRepo.findOne({ where: { id } });
      if (getRes == null) {
        throw new NotFoundException('Language not found');
      }
      return { statusCode: HttpStatus.OK, response: getRes };
    } catch (err) {
      throw err;
    }
  }

  public async getListByISO(
    { ISO }: DeepPartial<Language>,
    skip,
    take,
  ): Promise<ResponseModel<{ list: Language[]; count: number }>> {
    try {
      const [list, count] = await this._languageRepo
        .createQueryBuilder('repo')
        .andWhere('repo.ISO LIKE :ISO', { ISO })
        .orderBy('repo.ISO ASC')
        .skip(skip)
        .take(take)
        .getManyAndCount();
      return { statusCode: HttpStatus.OK, response: { list, count } };
    } catch (err) {
      throw err;
    }
  }

  public async delete({
    id,
  }: DeepPartial<Language>): Promise<ResponseModel<null>> {
    try {
      const exists = await this._languageRepo.exists({ where: { id } });
      if (!exists) {
        throw new NotFoundException('Language not found');
      }
      const deleteRes = await this._languageRepo.delete({ id });
      if (deleteRes.raw !== 0) {
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: 'data successfully deleted',
        };
      } else {
        throw new BadGatewayException('Something is wrong');
      }
    } catch (err) {
      throw err;
    }
  }
}
