import { Delete, Edit } from '@mui/icons-material';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { useGlobalDialogContext } from 'app/context/GlobalDialogContext';
import { useGlobalSnackbar } from 'app/context/GlobalSnackbarContext';
import { AppRoute, replaceRouteParams } from 'app/routes';
import { deleteRoom } from 'app/services/room';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Room } from 'types/room';
import { Seat } from 'types/seat';
import { BoxElement, SeatElement } from './SeatElement';

export const BOX_SIZE = 24;
export const BOX_SIZE_PX = `${BOX_SIZE}px`;

export const RoomElement = (props: {
  room: Room;
  seats: Seat[];
  reloadCinema: () => void;
  readOnly?: boolean;
}) => {
  const navigate = useNavigate();
  const { showDialog, setDialogLoading } = useGlobalDialogContext();
  const { showSuccessSnackbar, showErrorSnackbar } = useGlobalSnackbar();

  const { room, seats, reloadCinema, readOnly } = props;
  const widthRef = useRef(Math.max(...seats.map(seat => seat.column)) + 1);
  const heightRef = useRef(Math.max(...seats.map(seat => seat.row)) + 1);
  const width = widthRef.current;
  const height = heightRef.current;

  return (
    <Box sx={{ width: BOX_SIZE * width, position: 'relative' }}>
      <Stack
        direction={'row'}
        sx={{ height: `${BOX_SIZE * 2}px` }}
        alignItems="center"
        justifyContent={'center'}
      >
        <Typography textAlign={'center'}>{room.name}</Typography>
        {readOnly ? null : (
          <>
            <IconButton
              onClick={() => {
                navigate(
                  replaceRouteParams(AppRoute.ModRoomEdit, {
                    cinemaId: room.cinemaId.toString(),
                    roomId: room.roomId.toString(),
                  }),
                );
              }}
            >
              <Edit />
            </IconButton>
            <IconButton
              onClick={() => {
                showDialog({
                  title: 'Delete Room',
                  description: 'Are you sure to delete this room?',
                  onConfirm: () => {
                    setDialogLoading(true);
                    deleteRoom(room.roomId)
                      .then(() => {
                        showSuccessSnackbar('Delete room successfully');
                        reloadCinema();
                      })
                      .catch(() => {
                        showErrorSnackbar('Delete room failed');
                      })
                      .finally(() => {
                        setDialogLoading(false);
                      });
                  },
                });
              }}
            >
              <Delete />
            </IconButton>
          </>
        )}
      </Stack>
      <Box sx={{ height: BOX_SIZE_PX, minWidth: BOX_SIZE * 3 }}>
        <Typography sx={{ backgroundColor: 'lightgray' }} textAlign={'center'}>
          Screen
        </Typography>
      </Box>

      <Stack
        sx={{ position: 'absolute', top: `${BOX_SIZE * 3}px`, left: '-48px' }}
      >
        {Array.from({ length: height }, (_, i) => {
          return <BoxElement key={i} name={String.fromCharCode(65 + i)} />;
        })}
      </Stack>

      {Array.from({ length: height }, (_, i) => {
        return (
          <Stack key={i} direction={'row'}>
            {Array.from({ length: width }, (_, j) => {
              return (
                <SeatElement
                  key={`${i}-${j}`}
                  seat={seats.find(s => s.row === i && s.column === j)}
                />
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
