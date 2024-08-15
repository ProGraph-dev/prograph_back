import {
  BadGatewayException,
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Employee } from './entity/employee.entity';
import { ResponseModel } from 'src/utils/models/response.model';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee) private _employee: Repository<Employee>,
  ) {}

  public async save({
    description,
    photo,
    user,
    ISO,
  }: DeepPartial<Employee>): Promise<ResponseModel<Employee>> {
    try {
      if (!user) {
        throw new BadRequestException('User is required data');
      }
      const data = await this._employee.save({ description, photo, user, ISO });
      return { statusCode: HttpStatus.CREATED, response: data };
    } catch (err) {
      throw err;
    }
  }

  public async update({
    id,
    description,
    photo,
    ISO,
  }: DeepPartial<Employee>): Promise<ResponseModel<Employee>> {
    try {
      const employeeExists = await this._employee.exists({ where: { id } });
      if (employeeExists == false) {
        throw new NotFoundException('Employee info is not found');
      }
      const updateRes = await this._employee.update(
        { id },
        { description, photo, ISO },
      );
      if (updateRes.raw !== 0) {
        const getRes = await this._employee.findOne({ where: { id } });
        return { statusCode: HttpStatus.OK, response: getRes };
      } else {
        throw new BadGatewayException('Somethink is wrong');
      }
    } catch (err) {
      throw err;
    }
  }

  public async getList(
    skip: number,
    take: number,
  ): Promise<ResponseModel<{ list: Employee[]; count: number }>> {
    try {
      const [list, count] = await this._employee.findAndCount({ skip, take });
      return { statusCode: HttpStatus.OK, response: { list, count } };
    } catch (err) {
      throw err;
    }
  }

  public async getById({
    id,
  }: DeepPartial<Employee>): Promise<ResponseModel<Employee>> {
    try {
      const employee = await this._employee.findOne({
        where: { id },
        relations: {
          user: true,
        },
        select: {
          user: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
      });
      if (employee == null) {
        throw new NotFoundException('Employee Info is not found');
      } else {
        return { statusCode: HttpStatus.OK, response: employee };
      }
    } catch (err) {
      throw err;
    }
  }

  public async delete({
    id,
  }: DeepPartial<Employee>): Promise<ResponseModel<null>> {
    try {
      const employeeExists = await this._employee.exists({ where: { id } });
      if (employeeExists == false) {
        throw new NotFoundException('Employee info is not found');
      }
      const deleteRes = await this._employee.delete({ id });
      if (deleteRes.affected !== 0) {
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
