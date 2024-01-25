import { authAxiosInstance } from 'utils/axios';

export const countUnreadChats = () => {
  return authAxiosInstance.get('/chats/unread/count');
};
