export interface MessageIntefce {
  id?: number;
  chat: ChatInteface;
  sender?: SenderInterface;
  type: number;
  text: string;
  url: string;
}

interface ChatInteface {
  id: number;
}

interface SenderInterface {
  id: number;
  avatar?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  userRole?: number;
}
