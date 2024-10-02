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
import { ProductTypeService } from './product-type.service';
import { IsAdminGuard } from 'src/utils/guards/admin.guard';

@Controller('product-type')
export class ProductTypeController {
  constructor(private _productTypeService: ProductTypeService) {}

  @Post('/create')
  @UseGuards(IsAdminGuard)
  private async createProfession(@Body() { title, visible, ISO }) {
    try {
      const proRes = await this._productTypeService.save({
        title,
        visible,
        ISO,
      });
      if (proRes.statusCode == HttpStatus.CREATED) {
        return proRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Put('/update/:id')
  @UseGuards(IsAdminGuard)
  private async update(@Param('id') id, @Body() { title, visible, ISO }) {
    try {
      const updateRes = await this._productTypeService.update({
        id,
        title,
        visible,
        ISO,
      });
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
      const getRes = await this._productTypeService.getList(skip, take, ISO);
      if (getRes.statusCode == HttpStatus.OK) {
        return getRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Get('/by-title')
  private async getByTitle(@Query() { title, skip, take, ISO }) {
    try {
      const getRes = await this._productTypeService.getLikeTitle(
        { title, ISO },
        skip,
        take,
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
      const getRes = await this._productTypeService.getById({ id });
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
      const deleteRes = await this._productTypeService.delete({ id });
      if (deleteRes.statusCode == HttpStatus.NO_CONTENT) {
        return deleteRes;
      }
    } catch (err) {
      throw err;
    }
  }
}
