import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductType } from './entity/product-type.entity';
import { ProductTypeService } from './product-type.service';
import { ProductTypeController } from './product-type.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductType])],
  controllers: [ProductTypeController],
  providers: [ProductTypeService],
})
export class ProductTypeModule {}
