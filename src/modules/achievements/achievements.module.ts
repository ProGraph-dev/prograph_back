import { Module } from '@nestjs/common';
import { Achievement } from './entity/achievement.entity';
import { AchievementService } from './achievements.service';
import { AchievementController } from './achievements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Achievement])],
  controllers: [AchievementController],
  providers: [AchievementService],
})
export class AchievementModule {}
