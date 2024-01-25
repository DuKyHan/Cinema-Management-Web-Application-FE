import { rawAxiosInstance } from 'utils/axios';

export const forgetPassword = email => {
  return rawAxiosInstance.post('/auth/request-reset-password', {
    email,
  });
};
