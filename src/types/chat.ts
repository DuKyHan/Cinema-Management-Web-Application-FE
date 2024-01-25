export class Message {
  id: number;
  chatId: number;
  sender: number;
  message: string;
  createdAt: Date;
}

export class Participant {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatarId: number;
  chatId: number;
  participantId: number;
  read: boolean;
}

export class Chat {
  id: number;
  name: string;
  avatar: number;
  createdBy: number;
  ownerId: number;
  isBlocked: boolean;
  latestMessage?: Message | null;
  messages: Message[];
  participantIds: number[];
  participants: Participant[];
  createdAt: Date;
  updatedAt: Date;
}
