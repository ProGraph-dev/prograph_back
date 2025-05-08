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
import { ServicesService } from './services.service';
import { DeepPartial } from 'typeorm';
import { Services } from './entity/services.entity';
import { StatusEnum } from 'src/utils/enums/status.enum';
import { IsAdminGuard } from 'src/utils/guards/admin.guard';

@Controller('services')
export class ServicesController {
  constructor(private _servicesService: ServicesService) {}

  @Post('create')
  @UseGuards(IsAdminGuard)
  private async create(@Body() args: DeepPartial<Services>) {
    try {
      const createRes = await this._servicesService.save(args);
      if (createRes.statusCode == HttpStatus.CREATED) {
        return createRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Put('update/:id')
  @UseGuards(IsAdminGuard)
  private async update(@Body() args: DeepPartial<Services>, @Param('id') id) {
    try {
      args.id = +id;
      const updateRes = await this._servicesService.update(args);
      if (updateRes.statusCode == HttpStatus.OK) {
        return updateRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Get('get/:id')
  private async getById(@Param('id') id) {
    try {
      const getRes = await this._servicesService.getById(+id);
      if (getRes.statusCode == HttpStatus.OK) {
        return getRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Get('many')
  private async getMany(@Query() { ISO, skip, take, title }) {
    try {
      const getRes = await this._servicesService.getMany(
        ISO,
        +skip,
        +take,
        StatusEnum.ACTIVE,
        ['id', 'firstImg', 'title'],
        title,
      );
      if (getRes.statusCode == HttpStatus.OK) {
        return getRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Delete('delete/soft/:id')
  @UseGuards(IsAdminGuard)
  private async dleteSoft(@Param('id') id) {
    try {
      const updateRes = await this._servicesService.update({
        id,
        status: StatusEnum.INACTIVE,
      });
      if (updateRes.statusCode == HttpStatus.OK) {
        return updateRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Delete('delete/hard/:id')
  @UseGuards(IsAdminGuard)
  private async dleteHard(@Param('id') id) {
    try {
      const updateRes = await this._servicesService.delete(id);
      if (updateRes.statusCode == HttpStatus.NO_CONTENT) {
        return updateRes;
      }
    } catch (err) {
      throw err;
    }
  }
}
