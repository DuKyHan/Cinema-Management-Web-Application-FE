import { Box, ButtonBase, Stack, Typography } from '@mui/material';
import { SetSeatStatusButton } from 'app/pages/ModRoomCreateEditPage/component/SetSeatStatusButton';
import { useState } from 'react';
import { CreateSeatWithRoomInputDto, SeatStatus } from 'types/seat';
import { Loading } from '../Loading/Loading';
import { SelectableSeatElement } from './EditableSeatElement';
import { BOX_SIZE, BOX_SIZE_PX } from './RoomElement';
import { BoxElement } from './SeatElement';

export const EditableRoomElement = (props: {
  defaultSeats?: CreateSeatWithRoomInputDto[];
  onChange?: (seats: CreateSeatWithRoomInputDto[]) => void;
}) => {
  const { defaultSeats, onChange } = props;
  const [seats, setSeats] = useState<CreateSeatWithRoomInputDto[]>(
    defaultSeats ?? [],
  );
  const [firstSelectedSeat, setFirstSelectedSeat] =
    useState<CreateSeatWithRoomInputDto | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<
    CreateSeatWithRoomInputDto[]
  >([]);

  const updateSeatStatus = (status: SeatStatus) => {
    const newSeats = seats.map(s => {
      if (
        selectedSeats.some(ss => ss.row === s.row && ss.column === s.column)
      ) {
        return {
          ...s,
          status: status,
        };
      }
      return s;
    });
    setSeats(newSeats);
    setSelectedSeats([]);
    setFirstSelectedSeat(null);
    onChange?.(newSeats);
  };

  if (seats.length === 0) {
    return <Loading />;
  }

  const width = Math.max(...seats.map(seat => seat.column)) + 1;
  const height = Math.max(...seats.map(seat => seat.row)) + 1;

  return (
    <>
      <Stack direction={'row'} justifyContent="center" alignItems={'center'}>
        <Box sx={{ mr: 4 }}>
          <Typography variant={'h6'} sx={{ my: 1 }} fontWeight="bold">
            Room Preview
          </Typography>
          <Typography variant={'body1'} sx={{ my: 1 }}>
            Click on the seat to select it. Shift + click to unselect it.
          </Typography>
          <Typography variant={'body1'} sx={{ my: 1 }}>
            First click on the first seat, then click on the last seat to select
            a range of seats.
          </Typography>
          <Typography variant={'body1'} sx={{ my: 1 }}>
            Click on the buttons to the right to change the seat's status.
          </Typography>
        </Box>
        <SetSeatStatusButton color="green" name="Selected" />
        <SetSeatStatusButton
          color="white"
          name="Available"
          onClick={() => {
            updateSeatStatus(SeatStatus.Available);
          }}
        />
        <SetSeatStatusButton
          color="gray"
          name="Unavailable"
          onClick={() => {
            updateSeatStatus(SeatStatus.Unavailable);
          }}
        />
        <SetSeatStatusButton
          color="white"
          name="Empty"
          borderColor="lightgray"
          onClick={() => {
            updateSeatStatus(SeatStatus.Empty);
          }}
        />
      </Stack>
      <Box
        sx={{
          display: 'flex',
          my: 3,
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Box sx={{ width: BOX_SIZE * width, position: 'relative' }}>
          <Box sx={{ height: BOX_SIZE_PX, minWidth: BOX_SIZE * 3 }}>
            <Typography
              sx={{ backgroundColor: 'lightgray' }}
              textAlign={'center'}
            >
              Screen
            </Typography>
          </Box>

          <Stack sx={{ position: 'absolute', top: '24px', left: '-48px' }}>
            {Array.from({ length: height }, (_, i) => {
              return <BoxElement key={i} name={String.fromCharCode(65 + i)} />;
            })}
          </Stack>

          {Array.from({ length: height }, (_, i) => {
            return (
              <Stack key={i} direction={'row'}>
                {Array.from({ length: width }, (_, j) => {
                  const seat = seats.find(s => s.row === i && s.column === j)!;

                  return (
                    <ButtonBase
                      key={`${i}-${j}`}
                      onClick={event => {
                        if (seat == null) {
                          return;
                        }
                        const currentRow = seat.row;
                        const currentColumn = seat.column;
                        if (event.shiftKey) {
                          const newSelectedSeats = [...selectedSeats];
                          const from = newSelectedSeats.findIndex(
                            s =>
                              s.row === currentRow &&
                              s.column === currentColumn,
                          );
                          if (from < 0) {
                            return;
                          }
                          newSelectedSeats.splice(from, 1);
                          setSelectedSeats(newSelectedSeats);
                          if (
                            firstSelectedSeat != null &&
                            firstSelectedSeat.row === currentRow &&
                            firstSelectedSeat.column === currentColumn
                          ) {
                            setFirstSelectedSeat(null);
                          }
                          return;
                        }

                        if (firstSelectedSeat == null) {
                          setFirstSelectedSeat(seat);
                          setSelectedSeats([seat]);
                        } else {
                          const firstRow = firstSelectedSeat.row;
                          const firstColumn = firstSelectedSeat.column;

                          const minX = Math.min(firstColumn, currentColumn);
                          const maxX = Math.max(firstColumn, currentColumn);
                          const minY = Math.min(firstRow, currentRow);
                          const maxY = Math.max(firstRow, currentRow);

                          const newSeats: CreateSeatWithRoomInputDto[] = [];

                          for (let i = minY; i <= maxY; i++) {
                            for (let j = minX; j <= maxX; j++) {
                              newSeats.push(
                                seats.find(s => s.row === i && s.column === j)!,
                              );
                            }
                          }

                          setSelectedSeats(newSeats);
                          setFirstSelectedSeat(null);
                        }
                      }}
                    >
                      <SelectableSeatElement
                        key={`${i}-${j}`}
                        seat={seats.find(s => s.row === i && s.column === j)}
                        selected={selectedSeats.some(
                          s => s.row === i && s.column === j,
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
      </Box>
    </>
  );
};
