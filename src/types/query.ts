export class PaginationQueryDto {
  limit?: number;

  offset?: number;
}

export class CountQueryDto {
  startTime?: Date;

  endTime?: Date;
}
