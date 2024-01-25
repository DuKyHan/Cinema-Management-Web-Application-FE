import { rawAxiosInstance } from 'utils/axios';

export const register = async (email: string, password: string) => {
  return rawAxiosInstance.post('/auth/register', {
    email,
    password,
  });
};

export const login = async (email: string, password: string) => {
  return rawAxiosInstance.post('/auth/login', {
    email,
    password,
  });
};
