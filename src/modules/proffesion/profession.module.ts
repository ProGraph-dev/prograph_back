import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profession } from './entity/profession.entity';
import { ProfessionController } from './profession.controller';
import { ProfessionService } from './profession.service';

@Module({
  imports: [TypeOrmModule.forFeature([Profession])],
  controllers: [ProfessionController],
  providers: [ProfessionService],
})
export class ProfessionModule {}
