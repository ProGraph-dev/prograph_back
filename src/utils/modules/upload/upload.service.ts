import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Upload } from './entity/upload.entity';
import { DeepPartial, Repository } from 'typeorm';
import { ResponseModel } from 'src/utils/models/response.model';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Upload) private _uploadRepo: Repository<Upload>,
  ) {}

  public async create(
    file: DeepPartial<Upload>,
    type: number,
  ): Promise<ResponseModel<Upload>> {
    try {
      file.type = type;
      const saveRes = await this._uploadRepo.save(file);
      if (!saveRes) {
        throw new HttpException('Something is wrong', HttpStatus.BAD_GATEWAY);
      }
      return { response: saveRes, statusCode: HttpStatus.OK };
    } catch (err) {
      throw err;
    }
  }
}
