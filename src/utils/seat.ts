import { Room } from 'types/room';
import { CreateSeatWithRoomInputDto, SeatStatus } from 'types/seat';

export const createSeatsFromWidthAndHeight = (props: {
  width: number;
  height: number;
}): CreateSeatWithRoomInputDto[] => {
  const { width, height } = props;
  const seats: CreateSeatWithRoomInputDto[] = [];

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      seats.push({
        row: i,
        column: j,
        status: SeatStatus.Available,
      });
    }
  }

  return seats;
};

export const createSeatsFromRoom = (room: Room) => {
  const seats = room.seats!;
  const width = seats.map(seat => seat.column).reduce((a, b) => Math.max(a, b));
  const height = seats.map(seat => seat.row).reduce((a, b) => Math.max(a, b));
  const newSeats: CreateSeatWithRoomInputDto[] = [];

  return seats;
};
