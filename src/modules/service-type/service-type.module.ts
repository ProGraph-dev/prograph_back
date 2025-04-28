import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceType } from './entity/service-type.entity';
import { ServiceTypeController } from './service-type.controller';
import { ServiceTypeService } from './service-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceType])],
  controllers: [ServiceTypeController],
  providers: [ServiceTypeService],
})
export class ServicesModule {}
