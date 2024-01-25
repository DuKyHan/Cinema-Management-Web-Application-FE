import { Cinema } from './cinema';
import { Film } from './film';
import { PaginationQueryDto } from './query';
import { Room } from './room';
import { Seat } from './seat';

export class Ticket {
  id: number;

  seatId: number;

  premiereId: number;

  premiere: Date;

  accountId: number;

  createdAt: Date;

  updatedAt: Date;

  cinema?: Cinema;

  room?: Room;

  film?: Film;

  seat?: Seat;
}
export class CreateFoodBeverageDto {
  id: number;

  quantity: number;
}

export class CreateTicketDto {
  seatId: number;

  premiereId: number;

  foodBeverages?: CreateFoodBeverageDto[];
}

export enum TicketSort {
  PremiereDateAsc = 'premiereDate',
  PremiereDateDesc = '-premiereDate',
  CreatedAtAsc = 'createdAt',
  CreatedAtDesc = '-createdAt',
}

export class TicketQueryDto extends PaginationQueryDto {
  search?: string;

  accountId?: number;

  startPremiereDate?: Date;

  endPremiereDate?: Date;

  sort?: TicketSort;
}
