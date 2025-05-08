import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entity/chat.entity';
import { DeepPartial, Repository } from 'typeorm';
import { handlePostgresError } from 'src/utils/exceptions/postgres-error-handler.util';
import { ResponseModel } from 'src/utils/models/response.model';
import { assertFound } from 'src/utils/exceptions/all-exceptions.filter';

@Injectable()
export class ChatService {
  constructor(@InjectRepository(Chat) private _chatRepo: Repository<Chat>) {}

  public async save(args: DeepPartial<Chat>): Promise<ResponseModel<Chat>> {
    try {
      const saveRes = await this._chatRepo.save(args);
      if (saveRes) {
        return { response: saveRes, statusCode: HttpStatus.CREATED };
      }
    } catch (err) {
      handlePostgresError(err);
    }
  }

  public async update(args: DeepPartial<Chat>): Promise<ResponseModel<Chat>> {
    try {
      assertFound(await this._chatRepo.exists({ where: { id: args.id } }));
      const updateRes = await this._chatRepo.update({ id: args.id }, args);
      if (updateRes.affected !== 0) {
        return {
          statusCode: HttpStatus.OK,
          response: await this._chatRepo.findOne({ where: { id: args.id } }),
        };
      }
    } catch (err) {
      handlePostgresError(err);
    }
  }

  public async getChatByID(id: number): Promise<ResponseModel<Chat>> {
    try {
      const getRes = await assertFound(
        await this._chatRepo.findOne({ where: { id } }),
      );
      return { statusCode: HttpStatus.OK, response: getRes };
    } catch (err) {
      handlePostgresError(err);
    }
  }
}
