import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entity/project.entity';
import { DeepPartial, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { handlePostgresError } from 'src/utils/exceptions/postgres-error-handler.util';
import { ResponseModel } from 'src/utils/models/response.model';
import { assertFound } from 'src/utils/exceptions/all-exceptions.filter';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project) private _projectRepo: Repository<Project>,
  ) {}

  public async save(
    args: DeepPartial<Project>,
  ): Promise<ResponseModel<Project>> {
    try {
      const saveRes = await this._projectRepo.save(args);
      if (saveRes) {
        return { response: saveRes, statusCode: HttpStatus.CREATED };
      }
    } catch (err) {
      handlePostgresError(err);
    }
  }

  public async update(
    args: DeepPartial<Project>,
  ): Promise<ResponseModel<Project>> {
    try {
      assertFound(await this._projectRepo.exists({ where: { id: args.id } }));
      const updateRes = await this._projectRepo.update({ id: args.id }, args);
      if (updateRes.affected !== 0) {
        return {
          response: await this._projectRepo.findOne({ where: { id: args.id } }),
          statusCode: HttpStatus.OK,
        };
      }
    } catch (err) {
      handlePostgresError(err);
    }
  }

  public async getById(id: number): Promise<ResponseModel<Project>> {
    try {
      const getRes = assertFound(
        await this._projectRepo.findOne({
          where: { id },
          relations: { customer: true },
          select: {
            customer: {
              id: true,
              avatar: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        }),
      );
      return { statusCode: HttpStatus.OK, response: getRes };
    } catch (err) {
      handlePostgresError(err);
    }
  }

  public async CheckPidAndCid({
    project_id,
    customer_id,
  }: {
    project_id: number;
    customer_id: number;
  }): Promise<{ project_exist: boolean; is_customer: boolean }> {
    try {
      const project_exist = await this._projectRepo.exists({
        where: { id: project_id },
      });
      const is_customer = await this._projectRepo.exists({
        where: { id: project_id, customer: { id: customer_id } },
      });
      return { project_exist, is_customer };
    } catch (err) {
      handlePostgresError(err);
    }
  }

  public async getMany(
    skip: number,
    take: number,
    title?: string,
  ): Promise<ResponseModel<{ list: Project[]; count: number }>> {
    try {
      const fields: FindOptionsWhere<Project> = !title
        ? {}
        : {
            title: ILike(`%${title}%`),
          };
      const [list, count] = await this._projectRepo.findAndCount({
        where: fields,
        select: {
          customer: { id: true, avatar: true, firstName: true, lastName: true },
        },
        relations: { customer: true },
        order: { createdAt: 'DESC' },
        skip,
        take,
      });
      return {
        statusCode: HttpStatus.OK,
        response: { list, count },
      };
    } catch (err) {
      handlePostgresError(err);
    }
  }

  public async getManyByCustomerId(
    customer_id: number,
    skip: number,
    take: number,
    title?: string,
  ): Promise<ResponseModel<{ list: Project[]; count: number }>> {
    try {
      const fields: FindOptionsWhere<Project> = !title
        ? { customer: { id: customer_id } }
        : {
            customer: { id: customer_id },
            title: ILike(`%${title}%`),
          };
      const [list, count] = await this._projectRepo.findAndCount({
        where: fields,
        skip,
        take,
      });
      return {
        statusCode: HttpStatus.OK,
        response: { list, count },
      };
    } catch (err) {
      handlePostgresError(err);
    }
  }

  public async delete(id: number): Promise<ResponseModel<null>> {
    try {
      assertFound(await this._projectRepo.exists({ where: { id } }));
      const delRes = await this._projectRepo.delete({ id });
      if (delRes.affected !== 0) {
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
