export enum SeatStatus {
  Available = 'available',
  Unavailable = 'unavailable',
  Empty = 'empty',
}

export class Seat {
  seatId: number;

  roomId: number;

  name?: string;

  row: number;

  column: number;

  status: string;
}

export class CreateSeat {
  roomId: number;

  name?: string;

  row: number;

  column: number;

  status: string;
}

export class CreateSeatWithRoomInputDto {
  name?: string;

  row: number;

  column: number;

  status: string;
}
