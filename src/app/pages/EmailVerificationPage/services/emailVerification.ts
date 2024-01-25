import { rawAxiosInstance } from 'utils/axios';

export const emailVerification = (email, bits) => {
  return rawAxiosInstance.post('/auth/verify-account', {
    email,
    token: bits,
  });
};

export const sendEmailVerificationToken = email => {
  return rawAxiosInstance.post('/auth/send-verification-account-token', {
    email,
  });
};
