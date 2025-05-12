import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entity/chat.entity';
import { DeepPartial, Repository } from 'typeorm';
import { handlePostgresError } from 'src/utils/exceptions/postgres-error-handler.util';
import { ResponseModel } from 'src/utils/models/response.model';
import { assertFound } from 'src/utils/exceptions/all-exceptions.filter';
import { ProjectStatusEnum } from '../project/enum/project-status.enum';
import { Message } from './entity/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private _chatRepo: Repository<Chat>,
    @InjectRepository(Message) private _messageRepo: Repository<Message>,
  ) {}

  public async saveChat(
    project_id: number,
    user_ids: number[],
  ): Promise<ResponseModel<Chat>> {
    const queryRunner = this._chatRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const insertedChat = await queryRunner.query(
        `INSERT INTO chat ("projectId") VALUES ($1) RETURNING *`,
        [project_id],
      );
      const chat = insertedChat[0];
      if (!chat?.id) {
        throw new Error('Chat insert failed');
      }
      if (!user_ids.length) {
        throw new Error('No users provided for the chat');
      }
      const insertValues = user_ids
        .map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`)
        .join(',');
      const insertParams = user_ids.flatMap((userId) => [userId, chat.id]);
      await queryRunner.query(
        `INSERT INTO chat_user ("userId", "chatId") VALUES ${insertValues}`,
        insertParams,
      );
      const result = await queryRunner.query(
        `
        SELECT json_build_object(
          'id', c.id,
          'project', json_build_object(
            'id', p.id,
            'title', p.title
          )
        ) AS result
        FROM chat c
        LEFT JOIN project p ON p.id = c."projectId"
        WHERE c.id = $1
        `,
        [chat.id],
      );
      await queryRunner.commitTransaction();
      return { response: result[0].result, statusCode: HttpStatus.CREATED };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        'Failed to create chat',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  public async updateChat(
    args: DeepPartial<Chat>,
  ): Promise<ResponseModel<Chat>> {
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

  public async saveMessage(
    args: DeepPartial<Message>,
  ): Promise<ResponseModel<Message>> {
    try {
      const saveRes = await this._messageRepo.save(args);
      if (saveRes) {
        await this._chatRepo.query(`
          INSERT INTO user_readed_mesages ("messageId", "userId")
          VALUES (${saveRes.id}, ${args.sender.id})
          `);
        return { statusCode: HttpStatus.CREATED, response: saveRes };
      }
    } catch (err) {
      handlePostgresError(err);
    }
  }
}
