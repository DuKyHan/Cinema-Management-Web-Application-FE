import { authAxiosInstance } from 'utils/axios';

export enum ChatQuerySort {
  CreatedAtAsc = 'createdAt',
  CreatedAtDesc = '-createdAt',
  UpdatedAtAsc = 'updatedAt',
  UpdatedAtDesc = '-updatedAt',
}

export const getChats = async (query?: {
  limit?: number;
  offset?: number;
  messageLimit?: number;
  sort?: ChatQuerySort;
}) => {
  return authAxiosInstance.get('/chats', { params: query });
};

export const getChatMessages = async (
  chatId: number,
  query?: { limit?: number; offset?: number },
) => {
  return authAxiosInstance.get(`/chats/${chatId}/messages`, { params: query });
};

export const getAccountByNameOrEmail = async (query?: {
  search: string;
  excludeIds: number[];
  limit?: number;
  offset?: number;
}) => {
  return authAxiosInstance.get(`/accounts`, {
    params: {
      ...query,
      includes: 'profile',
      excludeIds: query?.excludeIds.join(','),
    },
  });
};

export const createChat = async (accountId: number) => {
  return authAxiosInstance.post('/chats', { to: accountId });
};
