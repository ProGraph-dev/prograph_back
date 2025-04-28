import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Services } from './entity/services.entity';
import { DeepPartial, Repository } from 'typeorm';
import { handlePostgresError } from 'src/utils/exceptions/postgres-error-handler.util';
import { ResponseModel } from 'src/utils/models/response.model';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Services) private _servicesRepo: Repository<Services>,
  ) {}

  public async save(
    args: DeepPartial<Services>,
  ): Promise<ResponseModel<Services>> {
    try {
      const saveRes = await this._servicesRepo.save(args);
      return { response: saveRes, statusCode: HttpStatus.CREATED };
    } catch (err) {
      handlePostgresError(err);
    }
  }

  public async update(
    args: DeepPartial<Services>,
  ): Promise<ResponseModel<Services>> {
    try {
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
}
