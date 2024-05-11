import { Module } from '@nestjs/common';
import { SocialsService } from './socials.service';
import { SocialsController } from './socials.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Socials } from './entity/socials.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Socials])],
  controllers: [SocialsController],
  providers: [SocialsService],
})
export class SocialsModule {}
