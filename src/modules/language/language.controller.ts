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
import { LanguageService } from './language.service';
import { IsAdminGuard } from 'src/utils/guards/admin.guard';

@Controller('language')
export class LanguageController {
  constructor(private _languageService: LanguageService) {}

  @Post('/save')
  @UseGuards(IsAdminGuard)
  private async saveLanguage(@Body() { ISO, path, title }) {
    try {
      const saveRes = await this._languageService.save({ ISO, path, title });
      if (saveRes.statusCode == HttpStatus.CREATED) {
        return saveRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Put('/update/:id')
  @UseGuards(IsAdminGuard)
  private async update(@Param('id') id, @Body() { ISO, path, title }) {
    try {
      const updateRes = await this._languageService.update({
        id,
        ISO,
        path,
        title,
      });
      if (updateRes.statusCode == HttpStatus.OK) {
        return updateRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Get('/get-by-ISO')
  private async getByISO(@Query() { ISO }) {
    try {
      const getRes = await this._languageService.getByISO({ ISO });
      if (getRes.statusCode == HttpStatus.OK) {
        return getRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Get('/get-by-id')
  private async getById(@Query() { id }) {
    try {
      const getRes = await this._languageService.getByISO({ id });
      if (getRes.statusCode == HttpStatus.OK) {
        return getRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Get('/get-list-by-ISO')
  private async getListByISO(@Query() { ISO, skip, take }) {
    try {
      const getRes = await this._languageService.getListByISO(
        { ISO },
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

  @Delete('/delete/:id')
  @UseGuards(IsAdminGuard)
  private async delete(@Param('id') id){
    try{
        const deleteRes = await this._languageService.delete({id});
        if(deleteRes.statusCode == HttpStatus.NO_CONTENT){
            return deleteRes;
        }
    }catch(err){
        throw err
    }
  }
}
