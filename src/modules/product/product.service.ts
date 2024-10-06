import {
  BadGatewayException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { Product } from './entity/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseModel } from 'src/utils/models/response.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private _productTypeRepo: Repository<Product>,
  ) {}

  public async save(
    data: DeepPartial<Product>,
  ): Promise<ResponseModel<Product>> {
    try {
      const product = await this._productTypeRepo.save(data);
      return { statusCode: HttpStatus.CREATED, response: product };
    } catch (err) {
      throw err;
    }
  }

  public async update(
    data: DeepPartial<Product>,
  ): Promise<ResponseModel<Product>> {
    try {
      const exist = await this._productTypeRepo.exists({
        where: { id: data.id },
      });
      if (!exist) {
        throw new NotFoundException('Data is not found');
      }
      const updateData = await this._productTypeRepo.update(
        { id: data.id },
        data,
      );
      if (updateData.raw !== 0) {
        const getRes = await this._productTypeRepo.findOne({
          where: { id: data.id },
        });
        return { statusCode: HttpStatus.OK, response: getRes };
      } else {
        throw new BadGatewayException('Somethink is wrong');
      }
    } catch (err) {
      throw err;
    }
  }

  public async getById({
    id,
  }: DeepPartial<Product>): Promise<ResponseModel<Product>> {
    try {
      const product = await this._productTypeRepo.findOne({
        where: { id },
      });
      if (product == null) {
        throw new NotFoundException('Data is not found');
      }
      return { statusCode: HttpStatus.OK, response: product };
    } catch (err) {
      throw err;
    }
  }

  public async getFiltered(
    { title, ISO }: DeepPartial<Product>,
    skip: number,
    take: number,
    typeId: number,
  ): Promise<ResponseModel<{ list: Product[]; count: number }>> {
    try {
      const query = this._productTypeRepo
        .createQueryBuilder('repo')
        .andWhere('repo.ISO = :ISO', { ISO });
      if (title) {
        query.andWhere('LOWER(repo.title) LIKE LOWER(:title)', {
          title: '%' + title.toLowerCase() + '%',
        });
      }
      if (typeId) {
        query.andWhere('repo.productTypeId = :typeId', {
          typeId,
        });
      }
      const [list, count] = await query.skip(skip).take(take).getManyAndCount();
      return { statusCode: HttpStatus.OK, response: { list, count } };
    } catch (err) {
      throw err;
    }
  }

  public async getList(
    ISO: string,
    skip: number,
    take: number,
  ): Promise<ResponseModel<{ list: Product[]; count: number }>> {
    try {
      const [list, count] = await this._productTypeRepo.findAndCount({
        where: { ISO },
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
  }: DeepPartial<Product>): Promise<ResponseModel<undefined>> {
    try {
      const exists = await this._productTypeRepo.exists({ where: { id } });
      if (!exists) {
        throw new NotFoundException('Product is not found');
      }
      const reqData = await this._productTypeRepo.delete({ id });
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
