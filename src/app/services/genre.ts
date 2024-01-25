import { authAxiosInstance } from 'utils/axios';

export const getGenre = async () => {
  return authAxiosInstance.get('/genres');
};

export const getGenreById = async (id: number) => {
  return authAxiosInstance.get(`/genres/${id}`);
};
