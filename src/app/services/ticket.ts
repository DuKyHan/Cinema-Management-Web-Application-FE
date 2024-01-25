import { CreateTicketDto, TicketQueryDto } from 'types/ticket';
import { authAxiosInstance } from 'utils/axios';

export const getTickets = (query?: TicketQueryDto) => {
  return authAxiosInstance.get('/tickets', {
    params: query,
  });
};

export const createTicket = (ticket: CreateTicketDto) => {
  return authAxiosInstance.post('/tickets', ticket);
};
