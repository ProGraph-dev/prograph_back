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
import { SocialsService } from './socials.service';
import { IsAdminGuard } from 'src/utils/guards/admin.guard';

@Controller('socials')
export class SocialsController {
  constructor(private _socialsService: SocialsService) {}

  @Post('/create')
  @UseGuards(IsAdminGuard)
  private async createAchievement(@Body() { link, title, icon, ISO }) {
    try {
      const saveRes = await this._socialsService.save({
        link,
        title,
        icon,
        ISO,
      });
      if (saveRes.statusCode == HttpStatus.CREATED) {
        return saveRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Get('/all')
  private async getAchievementList(@Query() { skip, take }) {
    try {
      const getRes = await this._socialsService.getList(skip, take);
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
      const getRes = await this._socialsService.getById({ id });
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
    @Body() { icon, link, title, ISO },
    @Param('id') id,
  ) {
    try {
      const updateRes = await this._socialsService.update({
        id,
        icon,
        link,
        title,
        ISO,
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
      const delRes = await this._socialsService.delete({ id });
      if (delRes.statusCode == HttpStatus.NO_CONTENT) {
        return delRes;
      }
    } catch (err) {
      throw err;
    }
  }
}
