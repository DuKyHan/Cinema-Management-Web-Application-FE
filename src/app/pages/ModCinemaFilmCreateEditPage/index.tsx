import { Add, Delete } from '@mui/icons-material';
import { Button, Grid, IconButton, Stack, Typography } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Loading } from 'app/components/Loading/Loading';
import { PricingRoomElement } from 'app/components/RoomElement/PricingRoomElement';
import { useGlobalDialogContext } from 'app/context/GlobalDialogContext';
import { useGlobalSnackbar } from 'app/context/GlobalSnackbarContext';
import { AppRoute } from 'app/routes';
import { getCinemas } from 'app/services/cinema';
import {
  createCinemaFilm,
  getCinemaFilmById,
  updateCinemaFilm,
} from 'app/services/cinema-film';
import { getFilms } from 'app/services/film';
import { getRoomsByCinemaId } from 'app/services/room';
import dayjs from 'dayjs';
import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import {
  AutocompleteElement,
  FormContainer,
  SelectElement,
} from 'react-hook-form-mui';
import { useNavigate, useParams } from 'react-router-dom';
import { Cinema } from 'types/cinema';
import { CinemaFilm, cinemaFilmIncludes } from 'types/cinema-film';
import { CreateCinemaFilmSeat } from 'types/cinema-film-seat';
import { EditMode } from 'types/edit-mode';
import { Film } from 'types/film';
import { Room } from 'types/room';
import { SeatStatus } from 'types/seat';

export const ModCinemaFilmCreateEditPage = (props: { mode: EditMode }) => {
  const { mode } = props;
  const navigate = useNavigate();
  const { cinemaFilmId } = useParams();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cinemaFilm, setCinemaFilm] = useState<CinemaFilm | null>();

  const { showDialog, setDialogLoading } = useGlobalDialogContext();
  const { showErrorSnackbar } = useGlobalSnackbar();
  const [isCinemaLoading, setIsCinemaLoading] = useState<boolean>(true);
  const [isFilmLoading, setIsFilmLoading] = useState<boolean>(true);
  const [isFilmSearchLoading, setIsFilmSearchLoading] =
    useState<boolean>(false);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedCinemaId, setSelectedCinemaId] = useState<number | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [premieres, setPremieres] = useState<(dayjs.Dayjs | null)[]>([]);
  const [pricedSeats, setPricedSeats] = useState<CreateCinemaFilmSeat[]>([]);

  const [filmValue, setFilmValue] = useState<Film | null>(null);
  const [filmInputValue, setFilmInputValue] = useState<string | null>(null);
  const [films, setFilms] = useState<Film[]>([]);

  const getNewFilms = useCallback(
    _.debounce((search?: string | null) => {
      setIsFilmSearchLoading(true);
      getFilms({
        search: search ?? undefined,
        limit: 10,
      }).then(res => {
        setFilms(res.data.data);
        setIsFilmSearchLoading(false);
        setIsFilmLoading(false);
      });
    }, 1000),
    [],
  );

  useEffect(() => {
    if (cinemaFilmId != null) {
      getCinemaFilmById(parseInt(cinemaFilmId), {
        includes: cinemaFilmIncludes,
      }).then(res => {
        const cinemaFilm: CinemaFilm = res.data.data;
        setCinemaFilm(cinemaFilm);
        setPremieres(cinemaFilm.premieres.map(p => dayjs(p.premiere)));
        setSelectedRoomId(cinemaFilm.roomId);
        setPricedSeats(cinemaFilm.cinemaFilmSeats!);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [cinemaFilmId]);

  useEffect(() => {
    getCinemas().then(res => {
      setCinemas(res.data.data);
      setIsCinemaLoading(false);
    });

    // Get new films is called above

    // getFilms({
    //   limit: 10,
    // }).then(res => {
    //   setFilms(res.data.data);
    //   setIsFilmLoading(false);
    // });
  }, []);

  useEffect(() => {
    if (selectedCinemaId != null) {
      getRoomsByCinemaId(selectedCinemaId).then(res => {
        setRooms(res.data.data);
      });
    }
  }, [selectedCinemaId]);

  useEffect(() => {
    getNewFilms(filmInputValue);
  }, [filmInputValue, getNewFilms]);

  if (isLoading || isCinemaLoading || isFilmLoading) {
    return <Loading />;
  }

  let selectedRoom: Room | null = null;
  if (selectedRoomId != null) {
    if (mode === EditMode.Edit) {
      selectedRoom = cinemaFilm?.room!;
      console.log(selectedRoom);
    } else {
      selectedRoom = rooms.find(r => r.roomId === selectedRoomId)!;
    }
  }

  return (
    <FormContainer
      defaultValues={cinemaFilm ?? undefined}
      onSuccess={data => {
        if (premieres.filter(p => p != null).length === 0) {
          showDialog({
            title: 'Error',
            description: 'Please create at least one premiere',
          });
          return;
        }
        if (
          selectedRoom!
            .seats!.filter(s => s.status === SeatStatus.Available)
            .some(s => pricedSeats.find(p => p.seatId === s.seatId) == null)
        ) {
          showDialog({
            title: 'Error',
            description: 'Please price all seats',
          });
          return;
        }
        showDialog({
          title:
            mode === EditMode.Edit ? 'Edit Cinema Film' : 'Create Cinema Film',
          description: `Are you sure you want to ${
            mode === EditMode.Edit ? 'edit' : 'create'
          } this cinema film?`,
          onConfirm: async () => {
            setDialogLoading(true);
            try {
              if (mode === EditMode.Edit) {
                await updateCinemaFilm(cinemaFilm!.id!, {
                  premieres: premieres
                    .filter(p => p != null)
                    .map(p => p!.toDate()),
                  seats: pricedSeats,
                });
              } else {
                await createCinemaFilm({
                  roomId: selectedRoomId!,
                  filmId: filmValue!.id,
                  premieres: premieres
                    .filter(p => p != null)
                    .map(p => p!.toDate()),
                  seats: pricedSeats,
                });
              }
              navigate(AppRoute.ModCinemaFilmList);
            } catch (err) {
              console.log(err);
              showErrorSnackbar(err.response.data.error.details);
            }
          },
        });
      }}
    >
      <Typography variant={'h4'} sx={{ my: 1 }} fontWeight="bold">
        {props.mode === EditMode.Create ? 'Create' : 'Edit'} Cinema Film
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Typography variant={'h6'} sx={{ my: 4 }} fontWeight="bold">
            Basic Info
          </Typography>
          {mode === EditMode.Edit ? (
            <Typography sx={{ my: 2 }}>
              Cinema: {cinemaFilm?.cinema?.name}
            </Typography>
          ) : (
            <SelectElement
              fullWidth
              name="cinemaId"
              label="Cinema"
              options={cinemas.map(cinema => ({
                id: cinema.id,
                label: cinema.name,
              }))}
              required
              onChange={e => {
                console.log(e);
                setSelectedCinemaId(e as number);
              }}
              sx={{ my: 2 }}
            />
          )}
          {mode === EditMode.Edit ? (
            <Typography sx={{ my: 2 }}>
              Room: {cinemaFilm?.room?.name}
            </Typography>
          ) : (
            <SelectElement
              fullWidth
              name="roomId"
              label="Room"
              options={[
                ...rooms.map(room => ({
                  id: room.roomId,
                  label: room.name,
                })),
              ]}
              required
              onChange={e => {
                console.log(e);
                setSelectedRoomId(e as number);
              }}
              sx={{ my: 2 }}
            />
          )}
          {mode === EditMode.Edit ? (
            <Typography sx={{ my: 2 }}>
              Film: {cinemaFilm?.film?.name}
            </Typography>
          ) : (
            <AutocompleteElement
              name="film"
              label="Film"
              loading={isFilmSearchLoading}
              autocompleteProps={{
                filterOptions: x => x,
                onChange: (event: any, newValue: Film | null) => {
                  setFilmValue(newValue);
                },
                onInputChange: (e, newInputValue) =>
                  setFilmInputValue(newInputValue),
                getOptionLabel: option =>
                  typeof option === 'string' ? option : option.name,
                sx: { my: 2 },
              }}
              options={films}
              required
            />
          )}
        </Grid>
        <Grid item xs={6}>
          <Stack direction={'row'}>
            <Typography variant={'h6'} sx={{ my: 4 }} fontWeight="bold">
              Premiere
            </Typography>
            <Button
              startIcon={<Add />}
              sx={{ ml: 4 }}
              onClick={() => {
                if (
                  premieres.length > 0 &&
                  premieres[premieres.length - 1] === null
                ) {
                  return;
                }
                return setPremieres([...premieres, null]);
              }}
            >
              Add premiere
            </Button>
          </Stack>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {premieres.map((premiere, index) => (
              <Stack direction={'row'} gap={2}>
                <DateTimePicker
                  key={index}
                  label="Premiere"
                  format="DD/MM/YYYY HH:mm"
                  sx={{ my: 2, width: '100%' }}
                  value={premiere ?? undefined}
                  onChange={newValue => {
                    const newPremieres = [...premieres];
                    newPremieres[index] = newValue;
                    setPremieres(newPremieres);
                  }}
                />
                <IconButton
                  onClick={() => {
                    const newPremieres = [...premieres];
                    newPremieres.splice(index, 1);
                    setPremieres(newPremieres);
                  }}
                >
                  <Delete />
                </IconButton>
              </Stack>
            ))}
          </LocalizationProvider>
        </Grid>
      </Grid>
      {selectedRoomId != null ? (
        <PricingRoomElement
          room={selectedRoom!}
          onPricedSeatsChanged={seats => setPricedSeats(seats)}
          defaultPricedSeats={cinemaFilm?.cinemaFilmSeats}
        />
      ) : null}
      <Stack direction={'row'} sx={{ my: 3 }} justifyContent="center" gap={2}>
        <Button
          variant="contained"
          color="error"
          onClick={() => navigate(AppRoute.ModCinemaFilmList)}
        >
          Back
        </Button>
        <Button type="submit" variant="contained">
          {props.mode === EditMode.Edit ? 'Save' : 'Create'}
        </Button>
      </Stack>
    </FormContainer>
  );
};
