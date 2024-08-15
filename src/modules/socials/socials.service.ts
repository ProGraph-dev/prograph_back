import {
  BadGatewayException,
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socials } from './entity/socials.entity';
import { DeepPartial, Repository } from 'typeorm';
import { ResponseModel } from 'src/utils/models/response.model';

@Injectable()
export class SocialsService {
  constructor(
    @InjectRepository(Socials) private _socialsRepo: Repository<Socials>,
  ) {}

  public async save({
    link,
    title,
    icon,
    ISO,
  }: DeepPartial<Socials>): Promise<ResponseModel<Socials>> {
    try {
      const exists = await this._socialsRepo.exists({ where: { title } });
      if (exists) {
        throw new BadRequestException(`Socials with ${title} title is exist`);
      }
      const saveRes = await this._socialsRepo.save({ link, title, icon, ISO });
      return { statusCode: HttpStatus.CREATED, response: saveRes };
    } catch (err) {
      throw err;
    }
  }

  public async update({
    id,
    icon,
    link,
    title,
    ISO,
  }: DeepPartial<Socials>): Promise<ResponseModel<Socials>> {
    try {
      const existsId = await this._socialsRepo.exists({ where: { id } });
      if (!existsId) {
        throw new NotFoundException('Socials with this id is not found');
      }
      const existsTitle = await this._socialsRepo.exists({ where: { title } });
      if (existsTitle) {
        throw new BadRequestException('Socials with same title is exist');
      }
      await this._socialsRepo.update({ id }, { icon, link, title, ISO });
      const socials = await this._socialsRepo.findOne({ where: { id } });
      return { statusCode: HttpStatus.OK, response: socials };
    } catch (err) {
      throw err;
    }
  }

  public async getById({
    id,
  }: DeepPartial<Socials>): Promise<ResponseModel<Socials>> {
    try {
      const getRes = await this._socialsRepo.findOne({ where: { id } });
      if (!getRes) {
        throw new NotFoundException('Socials whith that id is not found');
      }
      return { statusCode: HttpStatus.OK, response: getRes };
    } catch (err) {
      throw err;
    }
  }

  public async getList(
    skip: number,
    take: number,
  ): Promise<ResponseModel<{ list: Socials[]; count: number }>> {
    try {
      const [list, count] = await this._socialsRepo.findAndCount({
        skip,
        take,
      });
      return { statusCode: HttpStatus.OK, response: { list, count } };
    } catch (err) {
      throw err;
    }
  }

  public async delete({ id }: DeepPartial<Socials>) {
    try {
      const exists = await this._socialsRepo.exists({ where: { id } });
      if (!exists) {
        throw new NotFoundException('Socials is not found');
      }
      const delRes = await this._socialsRepo.delete({ id });
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
