import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Services } from './entity/services.entity';
import { DeepPartial, ILike, Repository } from 'typeorm';
import { handlePostgresError } from 'src/utils/exceptions/postgres-error-handler.util';
import { ResponseModel } from 'src/utils/models/response.model';
import { assertFound } from 'src/utils/exceptions/all-exceptions.filter';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Services) private _servicesRepo: Repository<Services>,
  ) {}

  public async save(
    args: DeepPartial<Services>,
  ): Promise<ResponseModel<Services>> {
    try {
      console.log({ args });

      const saveRes = await this._servicesRepo.save(args);
      return { response: saveRes, statusCode: HttpStatus.CREATED };
    } catch (err) {
      console.log({ err });

      handlePostgresError(err);
    }
  }

  public async update(
    args: DeepPartial<Services>,
  ): Promise<ResponseModel<Services>> {
    try {
      assertFound(await this._servicesRepo.exists({ where: { id: args.id } }));
      const updateRes = await this._servicesRepo.update({ id: args.id }, args);
      if (updateRes.affected !== 0) {
        return {
          statusCode: HttpStatus.OK,
          response: await this._servicesRepo.findOne({
            where: { id: args.id },
          }),
        };
      }
    } catch (err) {
      handlePostgresError(err);
    }
  }

  public async getById(id: number): Promise<ResponseModel<Services>> {
    try {
      const getRes = assertFound(
        await this._servicesRepo.findOne({
          where: { id },
          select: {
            creator: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          relations: { creator: true },
        }),
      );
      return { statusCode: HttpStatus.OK, response: getRes };
    } catch (err) {
      handlePostgresError(err);
    }
  }

  public async getMany(
    ISO: string,
    skip: number,
    take: number,
    status: number,
    selectFields?: (keyof Services)[],
    title?: string,
  ): Promise<ResponseModel<{ list: Services[]; count: number }>> {
    try {
      const [list, count] = await this._servicesRepo.findAndCount({
        where: { title: ILike(`%${title}%`), status, ISO },
        skip,
        take,
      });
      return { response: { list, count }, statusCode: HttpStatus.OK };
    } catch (err) {
      handlePostgresError(err);
    }
  }

  public async delete(id: number): Promise<ResponseModel<null>> {
    try {
      assertFound(await this._servicesRepo.exists({ where: { id } }));
      const deleteRes = await this._servicesRepo.delete({ id });
      if (deleteRes.affected !== 0) {
        return {
          statusCode: HttpStatus.NO_CONTENT,
          message: 'Data successfully deleted',
        };
      }
    } catch (err) {
      handlePostgresError(err);
    }
  }
}
