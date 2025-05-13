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
      await this._chatRepo.query(`
          UPDATE project SET "chatId" = ${result[0].result.id}
          WHERE project."id" = ${project_id}
        `);
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
    // const chatsIds: { id: number }[] = await this._chatRepo.query(`
    //         SELECT ch."id"
    //         FROM chat_user cu
    //         LEFT JOIN chat ch ON ch."id" = cu."chatId"
    //         LEFT JOIN project pj ON pj."id" = cu."chatId"
    //         WHERE cu."userId" = ${user_id} AND pj.status >= ${ProjectStatusEnum.PAYMENT};
    //     `);
    const chatsIds = await this._chatRepo
      .createQueryBuilder('chat')
      .leftJoin('chat.users', 'user')
      .leftJoin('chat.project', 'project')
      .where('user.id = :userId', { userId: user_id })
      .andWhere('project.status >= :status', {
        status: ProjectStatusEnum.PAYMENT,
      })
      .select('chat.id', 'id')
      .getRawMany();
    return chatsIds;
  }

  public async getChatListByUser(
    user_id: number,
    skip: number,
    take: number,
  ): Promise<ResponseModel<{ list: Chat[]; count: number }>> {
    try {
      const list = await this._chatRepo.query(`
          SELECT
            chat."id",
            json_agg(
              DISTINCT jsonb_build_object(
                'id', u."id",
                'firstName', u."firstName",
                'lastName', u."lastName",
                'role', u."userRole"
              )
            ) AS users,
            CASE
              WHEN m.id IS NOT NULL THEN json_build_object(
                'id', m."id",
                'text', m."text",
                'url', m.url,
                'type', m."type",
                'createdAt', m."createdAt",
                'sender', jsonb_build_object(
                  'id', sender.id,
                  'firstName', sender."firstName",
                  'lastName', sender."lastName",
                  'avatar', sender.avatar
                )
              )
              ELSE NULL
            END AS message,
            (
              SELECT COUNT(message."id")
              FROM message
              LEFT JOIN user_readed_mesages as mr
                ON mr."messageId" = message."id" AND mr."userId" = ${user_id}
              WHERE message."chatId" = chat."id"
                AND mr."messageId" IS NULL
            ) AS unreaded_count
          FROM chat
          INNER JOIN chat_user cu1 ON cu1."chatId" = chat."id"
          INNER JOIN chat_user cu2 ON cu2."chatId" = chat."id"
          INNER JOIN "user" u ON u."id" = cu2."userId"
          LEFT JOIN LATERAL (
            SELECT *
            FROM message
            WHERE message."chatId" = chat."id"
            ORDER BY message."createdAt" DESC
            LIMIT 1
          ) AS m ON true
          LEFT JOIN "user" as sender ON sender."id" = m."senderId"
          WHERE cu1."userId" = ${user_id}
          GROUP BY chat."id",
                   m.id, m.text, m.url, m.type, m."createdAt",
                   sender.id, sender."firstName", sender."lastName", sender.avatar
          ORDER BY m."createdAt" DESC NULLS LAST
          LIMIT ${take}
          OFFSET ${skip};
        `);
      const count = await this._chatRepo.count({
        where: { users: { id: user_id } },
      });
      return { statusCode: HttpStatus.OK, response: { list, count } };
    } catch (err) {
      handlePostgresError(err);
    }
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
