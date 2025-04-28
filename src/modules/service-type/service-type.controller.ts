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
import { DeepPartial } from 'typeorm';
import { IsAdminGuard } from 'src/utils/guards/admin.guard';
import { ServiceType } from './entity/service-type.entity';
import { ServiceTypeService } from './service-type.service';

@Controller('service-type')
export class ServiceTypeController {
  constructor(private _serviceTypeServ: ServiceTypeService) {}

  @Post('create')
  @UseGuards(IsAdminGuard)
  private async createService(
    @Body() { title, description, ISO }: DeepPartial<ServiceType>,
  ) {
    try {
      const createRes = await this._serviceTypeServ.save({
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
  private async updateServices(@Body() data: DeepPartial<ServiceType>) {
    try {
      const updateRes = await this._serviceTypeServ.update(data);
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
      const getRes = await this._serviceTypeServ.getLikeTilte(
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
      const getRes = await this._serviceTypeServ.getAllByFilter({
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
      const delRes = await this._serviceTypeServ.deleteServices(serviceId);
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
      const delRes = await this._serviceTypeServ.update({
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
