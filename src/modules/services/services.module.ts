import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from './entity/services.entity';
import { ServicesService } from './services.service';

@Module({
  imports: [TypeOrmModule.forFeature([Services])],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
