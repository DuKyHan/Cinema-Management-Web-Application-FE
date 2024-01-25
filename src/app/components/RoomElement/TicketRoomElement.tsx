import { Box, ButtonBase, Stack, Typography } from '@mui/material';
import { SetSeatStatusButton } from 'app/pages/ModRoomCreateEditPage/component/SetSeatStatusButton';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CinemaFilmSeat } from 'types/cinema-film-seat';
import { Room } from 'types/room';
import { Seat, SeatStatus } from 'types/seat';
import { requireNonNull } from 'utils/general';
import { SelectableSeatElement } from './EditableSeatElement';
import { BOX_SIZE, BOX_SIZE_PX } from './RoomElement';
import { BoxElement } from './SeatElement';

export const TicketRoomElement = (props: {
  room: Room;
  cinemaFilmSeats: CinemaFilmSeat[];
  purchasedSeats: number[];
  defaultSelectedSeat: Seat | null;
  onSeatSelected?: (seat: Seat, cinemaFilmSeat: CinemaFilmSeat) => void;
}) => {
  const { room, cinemaFilmSeats, defaultSelectedSeat, onSeatSelected } = props;

  const navigate = useNavigate();

  const seats = requireNonNull(room.seats);
  const widthRef = useRef(Math.max(...seats.map(seat => seat.column)) + 1);
  const heightRef = useRef(Math.max(...seats.map(seat => seat.row)) + 1);
  const width = widthRef.current;
  const height = heightRef.current;

  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(
    defaultSelectedSeat,
  );

  return (
    <Box sx={{ width: BOX_SIZE * width, position: 'relative' }}>
      <Stack direction={'row'} justifyContent="center" alignItems={'center'}>
        <SetSeatStatusButton color="green" name="Selected" />
        <SetSeatStatusButton color="white" name="Available" />
        <SetSeatStatusButton color="gray" name="Unavailable" />
        <SetSeatStatusButton
          color="white"
          name="Empty"
          borderColor="lightgray"
        />
      </Stack>
      <Stack
        direction={'row'}
        sx={{ height: `${BOX_SIZE * 2}px` }}
        alignItems="center"
        justifyContent={'center'}
      >
        <Typography textAlign={'center'}>Room: {room.name}</Typography>
      </Stack>
      <Box sx={{ height: BOX_SIZE_PX, minWidth: BOX_SIZE * 3 }}>
        <Typography sx={{ backgroundColor: 'lightgray' }} textAlign={'center'}>
          Screen
        </Typography>
      </Box>

      <Stack
        sx={{ position: 'absolute', top: `${BOX_SIZE * 4}px`, left: '-48px' }}
      >
        {Array.from({ length: height }, (_, i) => {
          return <BoxElement key={i} name={String.fromCharCode(65 + i)} />;
        })}
      </Stack>

      {Array.from({ length: height }, (_, i) => {
        return (
          <Stack key={i} direction={'row'}>
            {Array.from({ length: width }, (_, j) => {
              const seat = seats.find(s => s.row === i && s.column === j);
              const cinemaFilmSeat =
                seat == null
                  ? null
                  : cinemaFilmSeats.find(s => s.seatId === seat.seatId);
              return (
                <ButtonBase
                  key={`${i}-${j}`}
                  onClick={() => {
                    if (
                      seat != null &&
                      cinemaFilmSeat != null &&
                      seat.status === SeatStatus.Available &&
                      !props.purchasedSeats.includes(seat.seatId)
                    ) {
                      setSelectedSeat(seat);
                      onSeatSelected?.(seat, cinemaFilmSeat);
                    }
                  }}
                >
                  <SelectableSeatElement
                    seat={seats.find(s => s.row === i && s.column === j)}
                    selected={selectedSeat?.seatId === seat?.seatId}
                    purchased={props.purchasedSeats.includes(
                      seat?.seatId ?? -1,
                    )}
                  />
                </ButtonBase>
              );
            })}
          </Stack>
        );
      })}

      <Stack direction={'row'} sx={{ mt: BOX_SIZE_PX }}>
        {Array.from({ length: width }, (_, i) => {
          return <BoxElement key={i} name={(i + 1).toString()} />;
        })}
      </Stack>
    </Box>
  );
};
