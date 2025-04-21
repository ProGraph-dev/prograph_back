import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Services } from './entity/services.entity';
import { DeepPartial, Repository } from 'typeorm';
import { ResponseModel } from 'src/utils/models/response.model';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Services) private _srevicesRepo: Repository<Services>,
  ) {}

  public async save({
    title,
    description,
    ISO,
  }: DeepPartial<Services>): Promise<ResponseModel<Services>> {
    try {
      const saveRes = await this._srevicesRepo.save({
        title,
        description,
        ISO,
      });
      if (saveRes) {
        return { statusCode: HttpStatus.CREATED, response: saveRes };
      }
    } catch (err) {
      throw err;
    }
  }

  public async update(
    data: DeepPartial<Services>,
  ): Promise<ResponseModel<Services>> {
    try {
      const updateRes = await this._srevicesRepo.update({ id: data.id }, data);
      if (updateRes.affected !== 0) {
        return {
          statusCode: HttpStatus.OK,
          response: await this._srevicesRepo.findOne({
            where: { id: data.id },
          }),
        };
      }
    } catch (err) {
      throw err;
    }
  }

  public async getLikeTilte(
    skip: number,
    take: number,
    ISO: string,
    title?: string,
  ): Promise<ResponseModel<{ list: Services[]; count: number }>> {
    try {
      const query = this._srevicesRepo
        .createQueryBuilder('repo')
        .andWhere('repo.ISO = :ISO', { ISO })
        .andWhere('repo.isActive = TRUE');
      if (title) {
        query.andWhere('LOWER(repo.title) LIKE LOWER(:title)', {
          title: '%' + title.toLowerCase() + '%',
        });
      }
      const [list, count] = await query
        .skip(skip)
        .take(take)
        .orderBy('repo.title', 'ASC')
        .getManyAndCount();
      return { statusCode: HttpStatus.OK, response: { list, count } };
    } catch (err) {
      throw err;
    }
  }

  public async getAllByFilter({
    skip,
    take,
    ISO,
    title,
    isActive,
  }: {
    skip: number;
    take: number;
    ISO: string;
    title?: string;
    isActive?: boolean;
  }): Promise<ResponseModel<{ list: Services[]; count: number }>> {
    try {
      const query = this._srevicesRepo
        .createQueryBuilder('repo')
        .where('repo.ISO = :ISO', { ISO })
        .select(['repo.id', 'repo.title', 'repo.description', 'repo.isActive']);
      if (isActive !== null) {
        query.andWhere('repo.isActive = :isActive', { isActive });
      }
      if (title) {
        query.andWhere('LOWER(repo.title) LIKE LOWER(:title)', {
          title: `%${title.toLowerCase()}%`,
        });
      }
      const [list, count] = await query
        .skip(skip)
        .take(take)
        .orderBy('repo.title', 'ASC')
        .getManyAndCount();
      return { statusCode: HttpStatus.OK, response: { list, count } };
    } catch (err) {
      throw err;
    }
  }

  public async deleteServices(id: number): Promise<ResponseModel<null>> {
    try {
      const delRes = await this._srevicesRepo.delete({ id });
      if (delRes.affected !== 0) {
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: 'Data successfully deleted',
        };
      }
    } catch (err) {
      throw err;
    }
  }
}
