import { FileModel } from 'types/file';
import { authAxiosInstance } from 'utils/axios';

export const uploadFile = async (file: File): Promise<FileModel> => {
  const formData = new FormData();
  formData.append('file', file, file.name);
  const resFile = await authAxiosInstance.post('/files/upload', formData);
  return resFile.data.data;
};
