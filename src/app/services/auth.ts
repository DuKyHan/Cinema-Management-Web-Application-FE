import { ResetPasswordInputDto } from 'types/auth';
import { rawAxiosInstance } from 'utils/axios';

export const resetPassword = async (data: ResetPasswordInputDto) => {
  return rawAxiosInstance.post('/auth/reset-password', data);
};
