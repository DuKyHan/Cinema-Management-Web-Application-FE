import {
  CreateNewsInputDto,
  NewsStatus,
  NewsType,
  UpdateNewsStatusInputDto,
} from 'types/news';
import { PaginationQueryDto } from 'types/query';
import { authAxiosInstance } from 'utils/axios';
import { uploadFile } from './file';

export enum NewsInclude {
  Author = 'author',
  Organization = 'organization',
  Reference = 'reference',
}

export const newsIncludes = Object.values(NewsInclude);

export enum NewsSort {
  RelevanceAsc = 'relevance',
  RelevanceDesc = '-relevance',
  PopularityAsc = 'popularity',
  PopularityDesc = '-popularity',
  DateAsc = 'date',
  DateDesc = '-date',
  ViewsAsc = 'views',
  ViewsDesc = '-views',
}

export class NewsQueryDto extends PaginationQueryDto {
  includes?: NewsInclude[];
}

export class ManyNewsQueryDto extends NewsQueryDto {
  id?: number[];

  excludeIds?: number[];

  type?: NewsType[];

  status?: NewsStatus;

  organizationId?: number;

  authorId?: number;

  isPublished?: boolean;

  search?: string;

  sort?: NewsSort;
}

export const getNews = (query?: ManyNewsQueryDto) => {
  return authAxiosInstance.get('/news', {
    params: {
      ...query,
      id: query?.id?.join(','),
      excludeIds: query?.excludeIds?.join(','),
      type: query?.type?.join(','),
      includes: query?.includes?.join(','),
    },
  });
};

export const readNews = (id: number | string) => {
  return authAxiosInstance.post(`/news/${id}/read`);
};

export const countNews = (query?: ManyNewsQueryDto) => {
  return authAxiosInstance.get('/news/count', {
    params: {
      ...query,
      id: query?.id?.join(','),
      excludeIds: query?.excludeIds?.join(','),
      type: query?.type?.join(','),
    },
  });
};

export const getNewsById = (id: number | string, query?: NewsQueryDto) => {
  return authAxiosInstance.get(`/news/${id}`, {
    params: {
      ...query,
      includes: query?.includes?.join(','),
    },
  });
};

export const createNews = async (
  data: CreateNewsInputDto,
  thumbnailFile?: File | null,
) => {
  let thumbnailId: number | null = null;
  if (thumbnailFile) {
    thumbnailId = (await uploadFile(thumbnailFile)).id;
  }
  if (thumbnailId) {
    data.thumbnail = thumbnailId;
  }
  return authAxiosInstance.post('/news', data);
};

export const updateNews = async (
  id: number | string,
  data: CreateNewsInputDto,
  thumbnailFile?: File | null,
) => {
  let thumbnailId = data.thumbnail;
  if (thumbnailFile) {
    thumbnailId = (await uploadFile(thumbnailFile)).id;
  }
  if (thumbnailId) {
    data.thumbnail = thumbnailId;
  }
  return authAxiosInstance.put(`/news/${id}`, data);
};

export const deleteNews = (id: number | string) => {
  return authAxiosInstance.delete(`/news/${id}`);
};

export const approveNews = (
  id: number | string,
  data?: UpdateNewsStatusInputDto,
) => {
  return authAxiosInstance.post(`/news/${id}/approve`, data);
};

export const rejectNews = (
  id: number | string,
  data?: UpdateNewsStatusInputDto,
) => {
  return authAxiosInstance.post(`/news/${id}/reject`, data);
};
