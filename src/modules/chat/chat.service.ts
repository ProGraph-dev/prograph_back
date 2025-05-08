import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entity/chat.entity';
import { DeepPartial, Repository } from 'typeorm';
import { handlePostgresError } from 'src/utils/exceptions/postgres-error-handler.util';
import { ResponseModel } from 'src/utils/models/response.model';
import { assertFound } from 'src/utils/exceptions/all-exceptions.filter';
import { ProjectStatusEnum } from '../project/enum/project-status.enum';

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

  public async getChatIdsByUser(user_id: number): Promise<{ id: number }[]> {
    const chatsIds: { id: number }[] = await this._chatRepo.query(`
            SELECT ch."id"
            FROM chat_user cu
            LEFT JOIN chat ch ON ch."id" = cu."chatId"
            LEFT JOIN project pj ON pj."id" = cu."chatId"
            WHERE cu."userId" = ${user_id} AND pj.status >= ${ProjectStatusEnum.PAYMENT};
        `);
    return chatsIds;
  }
}
