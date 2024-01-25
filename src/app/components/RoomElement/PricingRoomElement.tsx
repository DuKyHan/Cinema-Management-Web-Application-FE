import { Delete } from '@mui/icons-material';
import {
  Box,
  Button,
  ButtonBase,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { SetSeatStatusButton } from 'app/pages/ModRoomCreateEditPage/component/SetSeatStatusButton';
import { useState } from 'react';
import { CreateCinemaFilmSeat } from 'types/cinema-film-seat';
import { Room } from 'types/room';
import { Seat, SeatStatus } from 'types/seat';
import { SelectableSeatElement } from './EditableSeatElement';
import { BOX_SIZE, BOX_SIZE_PX } from './RoomElement';
import { BoxElement } from './SeatElement';

// Vibrant css color names
const colors = [
  'aqua',
  'fuchsia',
  'lime',
  'maroon',
  'navy',
  'olive',
  'purple',
  'silver',
  'teal',
  'red',
  'orange',
  'yellow',
  'green',
  'cyan',
  'blue',
  'purple',
  'pink',
  'black',
];

export const PricingRoomElement = (props: {
  room: Room;
  onPricedSeatsChanged?: (seats: CreateCinemaFilmSeat[]) => void;
  defaultPricedSeats?: CreateCinemaFilmSeat[];
}) => {
  const { room, onPricedSeatsChanged, defaultPricedSeats } = props;
  const seats = room.seats!;
  const [firstSelectedSeat, setFirstSelectedSeat] = useState<Seat | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [prices, setPrices] = useState<number[]>(
    defaultPricedSeats
      ? Array.from(new Set(defaultPricedSeats.map(ps => ps.price)))
      : [],
  );
  const [pricedSeats, setPricedSeats] = useState<CreateCinemaFilmSeat[]>(
    defaultPricedSeats ?? [],
  );
  const [inputPrice, setInputPrice] = useState<number | null>(null);

  const width = Math.max(...seats.map(seat => seat.column)) + 1;
  const height = Math.max(...seats.map(seat => seat.row)) + 1;

  const selectionColor = colors[prices.length % colors.length];

  return (
    <>
      <Stack direction={'row'} justifyContent="center" alignItems={'center'}>
        <Box sx={{ mr: 4 }}>
          <Typography variant={'h6'} sx={{ my: 1 }} fontWeight="bold">
            Seat Pricing Preview
          </Typography>
          <Typography variant={'body1'} sx={{ my: 1 }}>
            Click on the seat to select it. Shift + click to unselect it.
          </Typography>
          <Typography variant={'body1'} sx={{ my: 1 }}>
            First click on the first seat, then click on the last seat to select
            a range of seats.
          </Typography>
        </Box>
        <SetSeatStatusButton color={selectionColor} name="Selected" />
        <SetSeatStatusButton color="white" name="Available" />
        <SetSeatStatusButton color="gray" name="Unavailable" />
        <SetSeatStatusButton
          color="white"
          name="Empty"
          borderColor="lightgray"
        />
      </Stack>
      <Grid container>
        <Grid item xs={8}>
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
                  return (
                    <BoxElement key={i} name={String.fromCharCode(65 + i)} />
                  );
                })}
              </Stack>

              {Array.from({ length: height }, (_, i) => {
                return (
                  <Stack key={i} direction={'row'}>
                    {Array.from({ length: width }, (_, j) => {
                      const seat = seats.find(
                        s => s.row === i && s.column === j,
                      )!;
                      const pricedSeat = pricedSeats.find(
                        ps => ps.seatId === seat.seatId,
                      );
                      const priceIndex =
                        pricedSeat == null
                          ? -1
                          : prices.indexOf(pricedSeat.price);

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

                              const newSeats: Seat[] = [];

                              for (let i = minY; i <= maxY; i++) {
                                for (let j = minX; j <= maxX; j++) {
                                  newSeats.push(
                                    seats.find(
                                      s => s.row === i && s.column === j,
                                    )!,
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
                            seat={seats.find(
                              s => s.row === i && s.column === j,
                            )}
                            selected={selectedSeats.some(
                              s => s.row === i && s.column === j,
                            )}
                            selectedColor={selectionColor}
                            availableColor={
                              priceIndex < 0 ? undefined : colors[priceIndex]
                            }
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
        </Grid>
        <Grid item xs={4}>
          <Stack direction={'row'}>
            <Typography variant={'h6'} sx={{ my: 3 }}>
              Pricing
            </Typography>
          </Stack>
          {prices.map((price, index) => (
            <Stack key={index} direction={'row'} sx={{ my: 1 }} gap={2}>
              <TextField
                key={index}
                value={price ?? undefined}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">VND</InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="start">
                      <Box
                        sx={{
                          width: '24px',
                          height: '24px',
                          ml: 1,
                          backgroundColor: colors[index % colors.length],
                        }}
                      ></Box>
                    </InputAdornment>
                  ),
                }}
                sx={{ my: 1 }}
              />
              <IconButton
                onClick={() => {
                  setPrices([...prices.filter(p => p !== price)]);
                  setPricedSeats([
                    ...pricedSeats.filter(ps => ps.price !== price),
                  ]);
                }}
              >
                <Delete />
              </IconButton>
            </Stack>
          ))}
          {selectedSeats.length > 0 ? (
            <Stack direction={'row'} sx={{ my: 1 }} gap={2}>
              <TextField
                type="number"
                onChange={e => {
                  if (e.target.value.trim() === '') {
                    setInputPrice(null);
                    return;
                  }
                  return setInputPrice(parseInt(e.target.value.trim()));
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">VND</InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="start">
                      <Box
                        sx={{
                          width: '24px',
                          height: '24px',
                          ml: 1,
                          backgroundColor: selectionColor,
                        }}
                      ></Box>
                    </InputAdornment>
                  ),
                }}
                value={inputPrice ?? ''}
              />
              <Button
                variant="contained"
                onClick={() => {
                  if (inputPrice == null) {
                    return;
                  }

                  const newPricedSeats = [
                    ...pricedSeats.filter(
                      ps => !selectedSeats.some(s => s.seatId === ps.seatId),
                    ),
                    ...selectedSeats
                      .filter(seat => seat.status === SeatStatus.Available)
                      .map(s => ({
                        seatId: s.seatId,
                        price: inputPrice,
                      })),
                  ];
                  setPricedSeats(newPricedSeats);
                  if (!prices.includes(inputPrice)) {
                    setPrices([...prices, inputPrice]);
                  }
                  setInputPrice(null);
                  setSelectedSeats([]);
                  setFirstSelectedSeat(null);
                  onPricedSeatsChanged?.(newPricedSeats);
                }}
              >
                Save
              </Button>
            </Stack>
          ) : null}
        </Grid>
      </Grid>
    </>
  );
};
