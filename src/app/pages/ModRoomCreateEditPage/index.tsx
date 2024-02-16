import { Button, Grid, Stack, TextField, Typography } from '@mui/material';
import { Loading } from 'app/components/Loading/Loading';
import { EditableRoomElement } from 'app/components/RoomElement/EditableRoomElement';
import { useGlobalDialogContext } from 'app/context/GlobalDialogContext';
import { useGlobalSnackbar } from 'app/context/GlobalSnackbarContext';
import { AppRoute, replaceRouteParams } from 'app/routes';
import { createRoom, getRoomById, updateRoom } from 'app/services/room';
import { useEffect, useState } from 'react';
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';
import { useNavigate, useParams } from 'react-router-dom';
import { EditMode } from 'types/edit-mode';
import { Room } from 'types/room';
import { CreateSeatWithRoomInputDto } from 'types/seat';
import { createSeatsFromWidthAndHeight } from 'utils/seat';

export const ModRoomCreateEditPage = (props: { editMode?: EditMode }) => {
  const formContext = useForm();
  const { cinemaId, roomId } = useParams();
  const navigate = useNavigate();
  const { editMode } = props;
  const { showDialog, setDialogLoading } = useGlobalDialogContext();
  const { showSuccessSnackbar, showErrorSnackbar } = useGlobalSnackbar();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [room, setRoom] = useState<Room | null>(null);

  const [roomName, setRoomName] = useState<string | null>(null);
  const [roomWidth, setRoomWidth] = useState<number | null>(null);
  const [roomHeight, setRoomHeight] = useState<number | null>(null);
  const [seats, setSeats] = useState<CreateSeatWithRoomInputDto[]>([]);

  useEffect(() => {
    if (roomId != null) {
      getRoomById(roomId).then(res => {
        const room = res.data.data;
        const seats = room.seats!;
        const width = Math.max(...seats.map(seat => seat.column)) + 1;
        const height = Math.max(...seats.map(seat => seat.row)) + 1;

        setRoom(room);
        setIsLoading(false);
        setRoomWidth(width);
        setRoomHeight(height);
      });
    } else {
      setIsLoading(false);
    }
  }, [roomId]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <FormContainer
      context={formContext}
      defaultValues={room ?? undefined}
      onSuccess={data => {
        showDialog({
          title: `${editMode === EditMode.Create ? 'Create' : 'Edit'} Room`,
          description: `Are you sure you want to ${
            editMode === EditMode.Create ? 'create' : 'edit'
          } this room?`,
          onConfirm: async () => {
            setDialogLoading(true);
            try {
              if (editMode === EditMode.Edit) {
                await updateRoom(parseInt(roomId!), {
                  name: data.name,
                  seats: seats,
                });
              } else {
                await createRoom({
                  cinemaId: parseInt(cinemaId!),
                  name: data.name,
                  seats: seats,
                });
              }
              navigate(
                replaceRouteParams(AppRoute.Cinema, { cinemaId: cinemaId! }),
              );
            } catch (err) {
              showErrorSnackbar(err.response.data.error.details);
            } finally {
              setDialogLoading(false);
            }
          },
        });
      }}
    >
      <Typography variant={'h4'} sx={{ my: 1 }} fontWeight="bold">
        {editMode === EditMode.Create ? 'Create Room' : 'Edit Room'}
      </Typography>
      <Grid container spacing={6} sx={{ my: 4 }}>
        <Grid item xs={6}>
          <Typography variant={'h6'} sx={{ my: 1 }} fontWeight="bold">
            Basic Info
          </Typography>
          <TextFieldElement name="name" fullWidth label="Room name" required />
        </Grid>
        <Grid item xs={6}>
          <Typography variant={'h6'} sx={{ my: 1 }} fontWeight="bold">
            Seat Info
          </Typography>
          <TextField
            name="width"
            label="Room's width"
            type="number"
            sx={{ mr: 3, width: '30%' }}
            inputProps={{ min: 1, max: 50 }}
            value={roomWidth}
            onChange={e => {
              if (e.target.value.trim() === '') {
                setRoomWidth(null);
                return;
              }
              let value = parseInt(e.target.value);
              value = Math.min(value, 50);
              value = Math.max(value, 1);
              setRoomWidth(value);
            }}
            required
          />
          <TextField
            name="height"
            label="Room's height"
            sx={{ mr: 3, width: '30%' }}
            type="number"
            inputProps={{ min: 1, max: 26 }}
            value={roomHeight}
            onChange={e => {
              if (e.target.value.trim() === '') {
                setRoomHeight(null);
                return;
              }
              let value = parseInt(e.target.value);
              value = Math.min(value, 26);
              value = Math.max(value, 1);
              setRoomHeight(value);
            }}
            required
          />
        </Grid>
      </Grid>
      {roomWidth != null && roomHeight != null ? (
        <EditableRoomElement
          // Rerendering the component when the room's width and height change
          key={`${roomWidth}-${roomHeight}`}
          onChange={seats => {
            setSeats(seats);
          }}
          defaultSeats={
            room?.seats ??
            createSeatsFromWidthAndHeight({
              width: roomWidth,
              height: roomHeight,
            })
          }
        />
      ) : null}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent={'center'}
        spacing={2}
      >
        <Button
          onClick={() =>
            navigate(
              replaceRouteParams(AppRoute.Cinema, { cinemaId: cinemaId! }),
            )
          }
        >
          Back
        </Button>
        <Button
          disabled={roomWidth == null || roomHeight == null}
          type="submit"
          variant="contained"
          sx={{ my: 2 }}
        >
          {editMode === EditMode.Create ? 'Create' : 'Edit'} Room
        </Button>
      </Stack>
    </FormContainer>
  );
};
