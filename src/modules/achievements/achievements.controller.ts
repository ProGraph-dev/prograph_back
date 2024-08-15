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
import { AchievementService } from './achievements.service';
import { IsAdminGuard } from 'src/utils/guards/admin.guard';

@Controller('achievement')
export class AchievementController {
  constructor(private _achievementService: AchievementService) {}

  @Post('/create')
  @UseGuards(IsAdminGuard)
  private async createAchievement(@Body() { title, count, is_active }) {
    try {
      const saveRes = await this._achievementService.save({
        title,
        count,
        is_active,
      });
      if (saveRes.statusCode == HttpStatus.CREATED) {
        return saveRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Get('/all')
  private async getAchievementList(@Query() { skip, take, is_active }) {
    try {
      const getRes = await this._achievementService.getList(
        is_active,
        skip,
        take,
      );
      if (getRes.statusCode == HttpStatus.OK) {
        return getRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Get('/:id')
  private async getById(@Param('id') id) {
    try {
      const getRes = await this._achievementService.getById({ id });
      if (getRes.statusCode == HttpStatus.OK) {
        return getRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Put('/update/:id')
  @UseGuards(IsAdminGuard)
  private async updateAchievement(
    @Body() { count, title, is_active },
    @Param('id') id,
  ) {
    try {
      const updateRes = await this._achievementService.update({
        id,
        count,
        title,
        is_active,
      });
      if (updateRes.statusCode == HttpStatus.OK) {
        return updateRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Delete('delete/:id')
  private async delete(@Param('id') id) {
    try {
      const delRes = await this._achievementService.delete({ id });
      if (delRes.statusCode == HttpStatus.NO_CONTENT) {
        return delRes;
      }
    } catch (err) {
      throw err;
    }
  }
}
