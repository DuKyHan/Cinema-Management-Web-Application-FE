import { Socket } from 'socket.io-client';

export const sendMessage = async (
  socket: Socket,
  data: { chatId: number; message: string },
) => {
  console.log('sendMessage', data);
  return socket.emitWithAck('send-message', data);
};
