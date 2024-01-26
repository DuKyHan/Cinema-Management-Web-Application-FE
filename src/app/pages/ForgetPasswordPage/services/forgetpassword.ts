import { rawAxiosInstance } from 'utils/axios';

export const requestResetPassword = email => {
  return rawAxiosInstance.post('/auth/request-reset-password', {
    email,
  });
};
