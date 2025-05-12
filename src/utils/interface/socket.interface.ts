import { Socket } from 'socket.io';
import { User } from 'src/modules/user/entity/user.entity';
import { DecodeUserModel } from '../models/decode-user.model';

export interface SocketInterface extends Socket {
  user?: User | DecodeUserModel;
}
