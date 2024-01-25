import {
  CreateReportInputDto,
  GetReportQueryDto,
  UpdateReportStatusInputDto,
} from 'types/report';
import { authAxiosInstance } from 'utils/axios';

export const getReports = (query: GetReportQueryDto) => {
  return authAxiosInstance.get('/reports', {
    params: {
      ...query,
      id: query.id?.join(','),
      type: query.type?.join(','),
      status: query.status?.join(','),
      include: query.include?.join(','),
    },
  });
};

export const countReports = (query: GetReportQueryDto) => {
  return authAxiosInstance.get('/reports/count', {
    params: {
      ...query,
      id: query.id?.join(','),
      type: query.type?.join(','),
      status: query.status?.join(','),
    },
  });
};

export const getReportById = (id: number, query: GetReportQueryDto) => {
  return authAxiosInstance.get(`/reports/${id}`, {
    params: {
      ...query,
      id: query.id?.join(','),
      type: query.type?.join(','),
      status: query.status?.join(','),
      include: query.include?.join(','),
    },
  });
};

export const createReport = (data: CreateReportInputDto) => {
  return authAxiosInstance.post('/reports', data);
};

export const cancelReport = (id: number) => {
  return authAxiosInstance.put(`/reports/${id}/cancel`);
};

export const completeReport = (
  id: number | string,
  data: UpdateReportStatusInputDto,
) => {
  return authAxiosInstance.put(`/reports/${id}/complete`, data);
};

export const rejectReport = (
  id: number | string,
  data: UpdateReportStatusInputDto,
) => {
  return authAxiosInstance.put(`/reports/${id}/reject`, data);
};
