import { PaginationQueryDto } from './query';

export class ProfitOutputDto {
  count: number;

  profit: number;

  weekNumber: number;

  week: Date;
}

export class ThisMonthPreviousMonthOutputDto {
  total: number;
  totalThisMonth: number;
  totalPreviousMonth: number;
}

export class AnalyticsQueryDto extends PaginationQueryDto {
  startTime?: Date;

  endTime?: Date;
}
