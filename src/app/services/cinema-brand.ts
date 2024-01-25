import { authAxiosInstance } from 'utils/axios';
import { uploadFile } from './file';

export const getMyCinemaBrand = () => {
  return authAxiosInstance.get('/cinema-brands/me');
};

export const createCinemaBrand = async (
  data: {
    name: string;
  },
  logoFile: File,
) => {
  const res = await uploadFile(logoFile);
  const logo = res.id;

  return authAxiosInstance.post(`/cinema-brands/`, {
    name: data.name,
    logo,
  });
};

export const updateCinemaBrand = async (
  id: number,
  data: {
    name?: string;
    logo?: number;
  },
  logoFile?: File | null,
) => {
  let logo = data.logo;
  if (logoFile) {
    const res = await uploadFile(logoFile);
    logo = res.id;
  }

  return authAxiosInstance.put(`/cinema-brands/${id}`, {
    name: data.name,
    logo,
  });
};
