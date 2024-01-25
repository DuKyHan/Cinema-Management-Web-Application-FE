import {
  CreateCinemaFilmDto,
  GetCinemaFilmsQueryDto,
  UpdateCinemaFilmDto,
} from 'types/cinema-film';
import { authAxiosInstance } from 'utils/axios';

export const getCinemaFilms = (query?: GetCinemaFilmsQueryDto) => {
  return authAxiosInstance.get('/cinema-films', {
    params: { ...query, includes: query?.includes?.join(',') },
  });
};

export const getCinemaFilmById = (
  id: number | string,
  query?: GetCinemaFilmsQueryDto,
) => {
  return authAxiosInstance.get(`/cinema-films/${id}`, {
    params: { ...query, includes: query?.includes?.join(',') },
  });
};

export const createCinemaFilm = (data: CreateCinemaFilmDto) => {
  return authAxiosInstance.post('/cinema-films', data);
};

export const updateCinemaFilm = (id: number, data: UpdateCinemaFilmDto) => {
  return authAxiosInstance.put(`/cinema-films/${id}`, data);
};

export const deleteCinemaFilm = (id: number) => {
  return authAxiosInstance.delete(`/cinema-films/${id}`);
};
