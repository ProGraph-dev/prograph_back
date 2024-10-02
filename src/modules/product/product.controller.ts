import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { IsAdminGuard } from 'src/utils/guards/admin.guard';
import { DeepPartial } from 'typeorm';
import { Product } from './entity/product.entity';

@Controller('product')
export class ProductController {
  constructor(private _productService: ProductService) {}

  @Post('/create')
  @UseGuards(IsAdminGuard)
  private async createProfession(@Body() data: DeepPartial<Product>) {
    try {
      const saveRes = await this._productService.save(data);
      if (saveRes.statusCode == HttpStatus.CREATED) {
        return saveRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Put('/update/:id')
  @UseGuards(IsAdminGuard)
  private async update(@Param('id') id, @Body() data: DeepPartial<Product>) {
    try {
      data.id = id;
      const updateRes = await this._productService.update(data);
      if (updateRes.statusCode == HttpStatus.OK) {
        return updateRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Get('/list')
  private async getList(@Query() { skip, take, ISO }) {
    try {
      const getRes = await this._productService.getList(skip, take, ISO);
      if (getRes.statusCode == HttpStatus.OK) {
        return getRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Get('/by-filter')
  private async getByTitle(@Query() { title, skip, take, ISO, typeId }) {
    try {
      const getRes = await this._productService.getFiltered(
        { title, ISO },
        skip,
        take,
        typeId,
      );
      if (getRes.statusCode == HttpStatus.OK) {
        return getRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Get('/:id')
  private async getById(@Param('id') id) {
    try {
      const getRes = await this._productService.getById({ id });
      if (getRes.statusCode == HttpStatus.OK) {
        return getRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Delete('/:id')
  @UseGuards(IsAdminGuard)
  private async deleteProfession(@Param('id') id) {
    try {
      const deleteRes = await this._productService.delete({ id });
      if (deleteRes.statusCode == HttpStatus.NO_CONTENT) {
        return deleteRes;
      }
    } catch (err) {
      throw err;
    }
  }
}
