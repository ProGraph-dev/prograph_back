import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { CreateChatDTO } from './dto/chat.dto';
import { ChatService } from './chat.service';
import { ProjectService } from '../project/project.service';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import { CurrentUserInteface } from 'src/utils/interface/current-user.interface';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly _chatService: ChatService,
    private readonly _projectService: ProjectService,
  ) {}

  @Post('create')
  private async create(
    @Body() { project_id }: CreateChatDTO,
    @CurrentUser() user: CurrentUserInteface,
    @Res() reply: FastifyReply,
  ) {
    try {
      const getProjectRes = await this._projectService.getById(project_id);
      if (getProjectRes.statusCode === HttpStatus.OK) {
        const userIds = [user.id, getProjectRes.response.customer.id];
        const createChatRes = await this._chatService.saveChat(
          project_id,
          userIds,
        );
        if (createChatRes.statusCode == HttpStatus.CREATED) {
          return reply
            .status(createChatRes.statusCode)
            .send(createChatRes.response);
        }
      }
    } catch (err) {
      throw err;
    }
  }

  @Get('my/list')
  private async getMyChatList(
    @CurrentUser() user: CurrentUserInteface,
    @Query() { skip, take },
    @Res() reply: FastifyReply,
  ) {
    try {
      const getRes = await this._chatService.getChatListByUser(
        user.id,
        +skip,
        +take,
      );
      if (getRes.statusCode == HttpStatus.OK) {
        return reply.send(getRes.response).status(getRes.statusCode);
      }
    } catch (err) {
      throw err;
    }
  }
}
