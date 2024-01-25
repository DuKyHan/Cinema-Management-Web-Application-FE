import { PaginationQueryDto } from 'types/query';
import { authAxiosInstance } from 'utils/axios';
import { uploadFile } from './file';

export enum FilmInclude {
  Actors = 'actors',
}

export const filmIncludes = Object.values(FilmInclude);

export class FilmQueryDto extends PaginationQueryDto {
  search?: string;

  includes?: FilmInclude[];
}

export class FilmPremiereQueryDto extends FilmQueryDto {
  startDate?: Date;

  endDate?: Date;

  ownerId?: number;
}

export class CreateFilmDto {
  name: string;
  description: string;
  AgeRestricted: string;
  Duration: number;
  TrailerLink?: string;
  thumbnailId?: number;
  actors?: string[];
  genres?: number[];
}

export const getFilms = (query?: FilmQueryDto) => {
  return authAxiosInstance.get('/films', {
    params: query,
  });
};

export const getFilmPremieres = (query?: FilmPremiereQueryDto) => {
  return authAxiosInstance.get('/films/premieres', {
    params: query,
  });
};

export const getFilmById = (id: number | string, query?: FilmQueryDto) => {
  return authAxiosInstance.get(`/films/${id}`, { params: query });
};

export const getFilmPremiereById = (
  id: number | string,
  query?: FilmPremiereQueryDto,
) => {
  return authAxiosInstance.get(`/films/${id}/premieres`, { params: query });
};

export const createFilm = async (
  data: CreateFilmDto,
  thumbnailFile?: File | null,
) => {
  let thumbnailId = data.thumbnailId;
  if (thumbnailFile) {
    const file = await uploadFile(thumbnailFile);
    thumbnailId = file.id;
  }
  return authAxiosInstance.post('/films', { ...data, thumbnailId });
};

export const updateFilm = async (
  id: number,
  data: CreateFilmDto,
  thumbnailFile?: File | null,
) => {
  let thumbnailId = data.thumbnailId;
  if (thumbnailFile) {
    const file = await uploadFile(thumbnailFile);
    thumbnailId = file.id;
  }
  return authAxiosInstance.put(`/films/${id}`, { ...data, thumbnailId });
};

export const deleteFilm = (id: number) => {
  return authAxiosInstance.delete(`/films/${id}`);
};
