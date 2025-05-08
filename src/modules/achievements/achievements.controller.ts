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
  Res,
  UseGuards,
} from '@nestjs/common';
import { AchievementService } from './achievements.service';
import { IsAdminGuard } from 'src/utils/guards/admin.guard';
import {
  CreateAchievementDTO,
  UpdateAchievementDTO,
} from './dto/achivements.dto';
import { FastifyReply } from 'fastify';

@Controller('achievement')
export class AchievementController {
  constructor(private _achievementService: AchievementService) {}

  @Post('/create')
  @UseGuards(IsAdminGuard)
  private async createAchievement(
    @Body() { title, count, is_active }: CreateAchievementDTO,
    @Res() reply: FastifyReply,
  ) {
    try {
      const createRes = await this._achievementService.save({
        title,
        count,
        is_active,
      });
      if (createRes.statusCode == HttpStatus.CREATED) {
        return reply.status(HttpStatus.CREATED).send(createRes.response);
      }
    } catch (err) {
      throw err;
    }
  }

  @Get('/many')
  private async getAchievementList(
    @Query() { skip, take, is_active },
    @Res() reply: FastifyReply,
  ) {
    try {
      is_active = is_active == 'false' ? false : true;
      console.log({ is_active, skip, take });
      const getRes = await this._achievementService.getList(
        is_active,
        skip,
        take,
      );
      if (getRes.statusCode == HttpStatus.OK) {
        return reply.status(getRes.statusCode).send(getRes.response);
      }
    } catch (err) {
      throw err;
    }
  }

  @Get('/one/:id')
  private async getById(@Param('id') id, @Res() reply: FastifyReply) {
    try {
      const getRes = await this._achievementService.getById({ id });
      if (getRes.statusCode == HttpStatus.OK) {
        return reply.status(getRes.statusCode).send(getRes.response);
      }
    } catch (err) {
      throw err;
    }
  }

  @Put('/update')
  @UseGuards(IsAdminGuard)
  private async updateAchievement(
    @Body() { id, count, title, is_active }: UpdateAchievementDTO,
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
  @UseGuards(IsAdminGuard)
  private async delete(@Param('id') id, @Res() reply: FastifyReply) {
    try {
      const delRes = await this._achievementService.delete({ id });
      if (delRes.statusCode == HttpStatus.NO_CONTENT) {
        return reply.status(delRes.statusCode);
      }
    } catch (err) {
      throw err;
    }
  }
}
