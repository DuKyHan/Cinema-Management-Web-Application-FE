import {
  ChangeCinemaStatusDto,
  CinemaQueryDto,
  CreateCinemaDto,
  UpdateCinemaDto,
} from 'types/cinema';
import { authAxiosInstance } from 'utils/axios';

export const getCinemas = async (query?: CinemaQueryDto) => {
  return authAxiosInstance.get('/cinemas', { params: query });
};

export const countCinema = async (query?: CinemaQueryDto) => {
  return authAxiosInstance.get('/cinemas/count', { params: query });
};

export const getCinema = async (id: number | string) => {
  return authAxiosInstance.get(`/cinemas/${id}`);
};

export const createCinema = async (data: CreateCinemaDto) => {
  return authAxiosInstance.post('/cinemas', data);
};

export const updateCinema = async (
  id: number | string,
  data: UpdateCinemaDto,
) => {
  return authAxiosInstance.put(`/cinemas/${id}`, data);
};

export const deleteCinema = async (id: number) => {
  return authAxiosInstance.delete(`/cinemas/${id}`);
};

export const cancelCinema = async (id: number) => {
  return authAxiosInstance.post(`/cinemas/${id}/cancel`);
};

export const verifyCinema = async (
  id: number | string,
  data?: ChangeCinemaStatusDto,
) => {
  return authAxiosInstance.post(`/cinemas/${id}/verify`, data);
};

export const rejectCinema = async (
  id: number | string,
  data?: ChangeCinemaStatusDto,
) => {
  return authAxiosInstance.post(`/cinemas/${id}/reject`, data);
};

export const disableCinema = async (
  id: number | string,
  data?: ChangeCinemaStatusDto,
) => {
  return authAxiosInstance.post(`/cinemas/${id}/disable`, data);
};

export const enableCinema = async (
  id: number | string,
  data?: ChangeCinemaStatusDto,
) => {
  return authAxiosInstance.post(`/cinemas/${id}/enable`, data);
};
