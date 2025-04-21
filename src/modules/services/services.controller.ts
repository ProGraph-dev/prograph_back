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
import { IsAdminGuard } from 'src/utils/guards/admin.guard';

@Controller('services')
export class ServicesController {
  constructor(private _servicesServ: ServicesService) {}

  @Post('create')
  @UseGuards(IsAdminGuard)
  private async createService(
    @Body() { title, description, ISO }: DeepPartial<Services>,
  ) {
    try {
      const createRes = await this._servicesServ.save({
        title,
        description,
        ISO,
      });
      if (createRes.statusCode == HttpStatus.CREATED) {
        return createRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Put('update')
  @UseGuards(IsAdminGuard)
  private async updateServices(@Body() data: DeepPartial<Services>) {
    try {
      const updateRes = await this._servicesServ.update(data);
      if (updateRes.statusCode == HttpStatus.OK) {
        return updateRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Get('get-list')
  private async getServices(@Query() { skip, take, ISO, title }) {
    try {
      title = title.length == 0 ? null : title;
      const getRes = await this._servicesServ.getLikeTilte(
        +skip,
        +take,
        ISO,
        title,
      );
      if (getRes.statusCode == HttpStatus.OK) {
        return getRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Get('get-list-admin')
  @UseGuards(IsAdminGuard)
  private async getServicesAdmin(
    @Query() { skip, take, ISO, title, isActive },
  ) {
    try {
      title = title.length == 0 ? null : title;
      isActive =
        isActive === 'true' ? true : isActive === 'false' ? false : null;
      const getRes = await this._servicesServ.getAllByFilter({
        skip,
        take,
        ISO,
        title,
        isActive,
      });
      if (getRes.statusCode == HttpStatus.OK) {
        return getRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Delete('delete/hard/:serviceId')
  @UseGuards(IsAdminGuard)
  private async deleteServiceForce(@Param('serviceId') serviceId) {
    try {
      const delRes = await this._servicesServ.deleteServices(serviceId);
      if (delRes.statusCode == HttpStatus.NO_CONTENT) {
        return delRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Delete('delete/soft/:serviceId')
  @UseGuards(IsAdminGuard)
  private async deleteService(@Param('serviceId') serviceId) {
    try {
      const delRes = await this._servicesServ.update({
        id: serviceId,
        isActive: false,
      });
      if (delRes.statusCode == HttpStatus.OK) {
        return delRes;
      }
    } catch (err) {
      throw err;
    }
  }
}
