import { Controller, HttpStatus, Post } from '@nestjs/common';
import { ServicesService } from './services.service';
import { DeepPartial } from 'typeorm';
import { Services } from './entity/services.entity';

@Controller('services')
export class ServicesController {
  constructor(private _servicesService: ServicesService) {}

  @Post('create')
  private async create(args: DeepPartial<Services>) {
    try {
      const createRes = await this._servicesService.save(args);
      if (createRes.statusCode == HttpStatus.OK) {
        return createRes;
      }
    } catch (err) {
      throw err;
    }
  }
}
