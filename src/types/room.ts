import { CreateSeatWithRoomInputDto, Seat } from './seat';

export class Room {
  roomId: number;

  name: string;

  cinemaId: number;

  seats?: Seat[];
}

export class CreateRoomInputDto {
  cinemaId: number;

  name: string;

  seats?: CreateSeatWithRoomInputDto[];
}

export class UpdateRoomInputDto {
  name?: string;

  seats?: CreateSeatWithRoomInputDto[];
}
