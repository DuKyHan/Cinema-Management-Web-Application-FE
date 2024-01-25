import { AnalyticsQueryDto } from 'types/analytics';
import { authAxiosInstance } from 'utils/axios';

export const getProfit = async (query?: AnalyticsQueryDto) => {
  return authAxiosInstance.get('/analytics/profit', { params: query });
};

export const getProfitSummary = async () => {
  return authAxiosInstance.get('/analytics/profit/summary');
};

export const getTicketSummary = async () => {
  return authAxiosInstance.get('/analytics/tickets/summary');
};

export const getCinemaFilmSummary = async () => {
  return authAxiosInstance.get('/analytics/cinema-films/summary');
};

export const getAccountSummary = async () => {
  return authAxiosInstance.get('/analytics/accounts/summary');
};
