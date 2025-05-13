import {
  Controller,
  HttpStatus,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  fileMulterOptions,
  imageMulterOptions,
  videoMulterOptions,
  voiceMulterOptions,
} from './options/custom.multer-options';
import { FileTypeEnum } from './enums/file-type.enum';
import { Response } from 'express';

@Controller('upload')
export class UploadController {
  constructor(private readonly _uploadService: UploadService) {}

  @Post('img')
  @UseInterceptors(FileInterceptor('file', imageMulterOptions))
  private async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    try {
      console.log(file);
      const saveRes = await this._uploadService.create(
        file,
        FileTypeEnum.IMAGE,
      );
      console.log('barev');
      if (saveRes.statusCode == HttpStatus.CREATED) {
        return res.status(saveRes.statusCode).send(saveRes.response);
      }
    } catch (err) {
      throw err;
    }
  }

  @Post('vid')
  @UseInterceptors(FileInterceptor('file', videoMulterOptions))
  private async uploadVide(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    try {
      const saveRes = await this._uploadService.create(
        file,
        FileTypeEnum.VIDEO,
      );
      if (saveRes.statusCode == HttpStatus.CREATED) {
        return res.status(saveRes.statusCode).send(saveRes.response);
      }
    } catch (err) {
      throw err;
    }
  }

  @Post('file')
  @UseInterceptors(FileInterceptor('file', fileMulterOptions))
  private async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    try {
      const saveRes = await this._uploadService.create(file, FileTypeEnum.FILE);
      if (saveRes.statusCode == HttpStatus.CREATED) {
        return res.status(saveRes.statusCode).send(saveRes.response);
      }
    } catch (err) {
      throw err;
    }
  }

  @Post('voice')
  @UseInterceptors(FileInterceptor('file', voiceMulterOptions))
  private async uploadVoice(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    try {
      const saveRes = await this._uploadService.create(
        file,
        FileTypeEnum.VOICE,
      );
      if (saveRes.statusCode == HttpStatus.CREATED) {
        return res.status(saveRes.statusCode).send(saveRes.response);
      }
    } catch (err) {
      throw err;
    }
  }
}
