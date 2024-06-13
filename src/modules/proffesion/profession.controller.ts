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
import { ProfessionService } from './profession.service';
import { IsAdminGuard } from 'src/utils/guards/admin.guard';

@Controller('profession')
export class ProfessionController {
  constructor(private _professionService: ProfessionService) {}

  @Post('/create')
  @UseGuards(IsAdminGuard)
  private async createProfession(@Body() { title, description, ISO }) {
    try {
      const proRes = await this._professionService.save({
        title,
        description,
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
  private async update(@Param('id') id, @Body() { title, description, ISO }) {
    try {
      const updateRes = await this._professionService.update({
        id,
        title,
        description,
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
  private async getList(@Query() { skip, take }) {
    try {
      const getRes = await this._professionService.getList(skip, take);
      if (getRes.statusCode == HttpStatus.OK) {
        return getRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Get('/by-title')
  private async getByTitle(@Query() { title, skip, take }) {
    try {
      const getRes = await this._professionService.getLikeTitle(
        { title },
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
      const getRes = await this._professionService.getById({ id });
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
      const deleteRes = await this._professionService.delete({ id });
      if (deleteRes.statusCode == HttpStatus.NO_CONTENT) {
        return deleteRes;
      }
    } catch (err) {
      throw err;
    }
  }
}
