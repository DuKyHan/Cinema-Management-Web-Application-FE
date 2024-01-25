import { rawAxiosInstance } from 'utils/axios';

export const enterCodeForgetPassword = email => {
  return rawAxiosInstance.post('/auth/reset-password', {
    email,
  });
};
