import { rawAxiosInstance } from 'utils/axios';

export const signup = (email, password) => {
  return rawAxiosInstance.post('/auth/register', {
    email,
    password,
  });
};
