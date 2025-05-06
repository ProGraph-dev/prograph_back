import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { ResponseModel } from 'src/utils/models/response.model';
import { ServiceType } from './entity/service-type.entity';

@Injectable()
export class ServiceTypeService {
  constructor(
    @InjectRepository(ServiceType)
    private _sreviceTypeRepo: Repository<ServiceType>,
  ) {}

  public async save({
    title,
    description,
    ISO,
  }: DeepPartial<ServiceType>): Promise<ResponseModel<ServiceType>> {
    try {
      const saveRes = await this._sreviceTypeRepo.save({
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
    data: DeepPartial<ServiceType>,
  ): Promise<ResponseModel<ServiceType>> {
    try {
      const updateRes = await this._sreviceTypeRepo.update(
        { id: data.id },
        data,
      );
      if (updateRes.affected !== 0) {
        return {
          statusCode: HttpStatus.OK,
          response: await this._sreviceTypeRepo.findOne({
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
  ): Promise<ResponseModel<{ list: ServiceType[]; count: number }>> {
    try {
      const query = this._sreviceTypeRepo
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
  }): Promise<ResponseModel<{ list: ServiceType[]; count: number }>> {
    try {
      const query = this._sreviceTypeRepo
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
      const delRes = await this._sreviceTypeRepo.delete({ id });
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
