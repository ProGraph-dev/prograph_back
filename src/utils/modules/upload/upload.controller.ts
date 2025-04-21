import {
  Controller,
  HttpStatus,
  Post,
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

@Controller('upload')
export class UploadController {
  constructor(private readonly _uploadService: UploadService) {}

  @Post('img')
  @UseInterceptors(FileInterceptor('file', imageMulterOptions))
  private async uploadImage(@UploadedFile() file: Express.Multer.File) {
    try {
      const saveRes = await this._uploadService.create(
        file,
        FileTypeEnum.IMAGE,
      );
      if (saveRes.getStatus() == HttpStatus.CREATED) {
        return saveRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Post('vid')
  @UseInterceptors(FileInterceptor('file', videoMulterOptions))
  private async uploadVide(@UploadedFile() file: Express.Multer.File) {
    try {
      const saveRes = await this._uploadService.create(
        file,
        FileTypeEnum.VIDEO,
      );
      if (saveRes.getStatus() == HttpStatus.CREATED) {
        return saveRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Post('file')
  @UseInterceptors(FileInterceptor('file', fileMulterOptions))
  private async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const saveRes = await this._uploadService.create(file, FileTypeEnum.FILE);
      if (saveRes.getStatus() == HttpStatus.CREATED) {
        return saveRes;
      }
    } catch (err) {
      throw err;
    }
  }

  @Post('voice')
  @UseInterceptors(FileInterceptor('file', voiceMulterOptions))
  private async uploadVoice(@UploadedFile() file: Express.Multer.File) {
    try {
      const saveRes = await this._uploadService.create(
        file,
        FileTypeEnum.VOICE,
      );
      if (saveRes.getStatus() == HttpStatus.CREATED) {
        return saveRes;
      }
    } catch (err) {
      throw err;
    }
  }
}
