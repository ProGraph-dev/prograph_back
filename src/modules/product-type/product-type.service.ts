import {
  BadGatewayException,
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductType } from './entity/product-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { ResponseModel } from 'src/utils/models/response.model';

@Injectable()
export class ProductTypeService {
  constructor(
    @InjectRepository(ProductType)
    private _productTypeRepo: Repository<ProductType>,
  ) {}

  public async save({
    title,
    visible,
    ISO,
  }: DeepPartial<ProductType>): Promise<ResponseModel<ProductType>> {
    try {
      const exist = await this._productTypeRepo.exists({ where: { title } });
      if (exist) {
        throw new BadRequestException(
          `Product type with title ${title} is exist`,
        );
      }
      const productType = await this._productTypeRepo.save({
        ISO,
        title,
        visible,
      });
      return { statusCode: HttpStatus.CREATED, response: productType };
    } catch (err) {
      throw err;
    }
  }

  public async update({
    id,
    title,
    visible,
    ISO,
  }: DeepPartial<ProductType>): Promise<ResponseModel<ProductType>> {
    try {
      let productType = await this._productTypeRepo.findOne({ where: { id } });
      if (!productType) {
        throw new NotFoundException('ProductType is not found');
      }
      if (productType.title == title) {
        throw new BadRequestException(
          `Product type with title ${title} is exist`,
        );
      }
      const updateData = await this._productTypeRepo.update(
        { id },
        { title, visible, ISO },
      );
      if (updateData.raw !== 0) {
        productType = await this._productTypeRepo.findOne({ where: { id } });
        return { statusCode: HttpStatus.OK, response: productType };
      } else {
        throw new BadGatewayException('Somethink is wrong');
      }
    } catch (err) {
      throw err;
    }
  }

  public async getById({
    id,
  }: DeepPartial<ProductType>): Promise<ResponseModel<ProductType>> {
    try {
      const productType = await this._productTypeRepo.findOne({
        where: { id },
      });
      if (productType == null) {
        throw new NotFoundException('Data is not found');
      }
      return { statusCode: HttpStatus.OK, response: productType };
    } catch (err) {
      throw err;
    }
  }

  public async getLikeTitle(
    { title, ISO }: DeepPartial<ProductType>,
    skip: number,
    take: number,
  ): Promise<ResponseModel<{ list: ProductType[]; count: number }>> {
    try {
      const query = this._productTypeRepo
        .createQueryBuilder('repo')
        .andWhere('repo.ISO = :ISO', { ISO });
      if (title) {
        query.andWhere('LOWER(repo.title) LIKE LOWER(:title)', {
          title: '%' + title.toLowerCase() + '%',
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
  ): Promise<ResponseModel<{ list: ProductType[]; count: number }>> {
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
  }: DeepPartial<ProductType>): Promise<ResponseModel<undefined>> {
    try {
      const exists = await this._productTypeRepo.exists({ where: { id } });
      if (!exists) {
        throw new NotFoundException('ProductType is not found');
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
