import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { verify, JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { ChatService } from './chat.service';
import { SocketInterface } from 'src/utils/interface/socket.interface';
import { UserService } from '../user/user.service';
import { HttpStatus } from '@nestjs/common';
import { MessageIntefce } from './interface/message.inteface';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'chat',
  transports: ['websocket'],
})
export class ChatGateway implements OnGatewayDisconnect, OnGatewayConnection {
  @WebSocketServer()
  private server: Server;

  constructor(
    private readonly _chatService: ChatService,
    private readonly _userService: UserService,
  ) {}

  public async handleConnection(socket: SocketInterface) {
    try {
      const token = socket.handshake.headers.token as string;
      if (!token) {
        socket.disconnect(true);
        return;
      }
      let decode: any;
      try {
        decode = verify(token, process.env.JWT_SECRET);
      } catch (err) {
        if (err instanceof JsonWebTokenError) {
          console.warn('JWT Error:', err.message);
        } else if (err instanceof TokenExpiredError) {
          console.warn('JWT Token expired');
        } else {
          console.error('Unexpected error while verifying token:', err);
        }
        socket.disconnect(true);
        return;
      }
      const getUserRes = await this._userService.getUserForChat(decode.id);
      if (getUserRes.statusCode == HttpStatus.OK) {
        socket.user = getUserRes.response;
        const getChatIdsRes = await this._chatService.getChatIdsByUser(
          socket.user.id,
        );
        getChatIdsRes.forEach((chat) => {
          socket.join(`chat_${chat.id}`);
        });
      }
    } catch (error) {
      console.error('Error in handleConnection:', error);
      socket.disconnect(true);
    }
  }

  public async handleDisconnect(socket: SocketInterface) {
    socket.disconnect(true);
  }

  @SubscribeMessage('message')
  private async message(
    @MessageBody()
    { type, text, url, chat }: MessageIntefce,
    @ConnectedSocket()
    socket: SocketInterface,
  ) {
    try {
      const savedMessage = await this._chatService.saveMessage({
        chat: { id: chat.id },
        sender: { id: socket.user.id },
        type: type,
        text: text,
        url: url,
      });
      if (savedMessage.statusCode == HttpStatus.OK) {
        this.server.to(`chat_${chat.id}`).emit('message', {
          type,
          text,
          url,
          chat,
          sender: socket.user,
          createdAt: savedMessage.response.createdAt,
        });
      }
    } catch (err) {
      console.error('Error in message event:', err);
      throw new WsException('Failed to process message');
    }
  }
}
