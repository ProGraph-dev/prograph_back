import { Module } from '@nestjs/common';
import { LanguageController } from './language.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from './entity/language.entity';
import { LanguageService } from './language.service';

@Module({
  imports: [TypeOrmModule.forFeature([Language])],
  controllers: [LanguageController],
  providers: [LanguageService],
})
export class LanguageModule {}
