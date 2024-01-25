import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { Map, Marker } from '@vis.gl/react-google-maps';
import { Loading } from 'app/components/Loading/Loading';
import { RoomElement } from 'app/components/RoomElement/RoomElement';
import { useAuth } from 'app/context/AuthContext';
import { AppRoute, replaceRouteParams } from 'app/routes';
import { getCinema } from 'app/services/cinema';
import { getRoomsByCinemaId } from 'app/services/room';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Cinema } from 'types/cinema';
import { Room } from 'types/room';
import { locationToString } from 'utils/location';

export const CinemaPage = () => {
  const { account } = useAuth();
  const { cinemaId } = useParams();
  const navigate = useNavigate();
  const [cinema, setCinema] = useState<Cinema>();
  const [rooms, setRooms] = useState<Room[]>();

  const reloadCinema = useCallback(() => {
    getCinema(parseInt(cinemaId!)).then(res => {
      setCinema(res.data.data);
    });
    getRoomsByCinemaId(cinemaId!).then(res => {
      console.log(res.data.data);
      setRooms(res.data.data);
    });
  }, [cinemaId]);

  useEffect(() => {
    reloadCinema();
  }, [reloadCinema]);

  if (cinema == null || rooms == null) {
    return <Loading />;
  }

  const isOwner = cinema.cinemaBrand!.ownerId === account!.id;

  return (
    <>
      <Grid container spacing={2} sx={{ minHeight: '400px' }}>
        <Grid item xs={6}>
          <Typography variant={'h4'} sx={{ my: 1 }} fontWeight="bold">
            {cinema.name}
          </Typography>
          <Typography sx={{ my: 1 }}>{cinema.description}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant={'h6'} sx={{ my: 1 }} fontWeight="bold">
            Location
          </Typography>
          <Typography sx={{ my: 1 }}>
            {locationToString(cinema.location)}
          </Typography>
          {cinema.location != null &&
          cinema.location.latitude != null &&
          cinema.location.longitude != null ? (
            <Map
              zoom={17}
              center={{
                lat: cinema.location.latitude!,
                lng: cinema.location.longitude!,
              }}
              gestureHandling={'none'}
              disableDefaultUI={true}
            >
              <Marker
                position={{
                  lat: cinema.location.latitude!,
                  lng: cinema.location.longitude!,
                }}
              />
            </Map>
          ) : null}
        </Grid>
      </Grid>
      <Typography variant={'h6'} sx={{ mt: 12, mb: 2 }} fontWeight="bold">
        Room
      </Typography>
      <Stack alignItems={'center'} gap={'48px'}>
        {rooms.length === 0 ? (
          <Typography width={'100%'}>No room available.</Typography>
        ) : null}
        {rooms.map((room, i) => {
          return (
            <RoomElement
              room={room}
              key={i}
              seats={room.seats!}
              reloadCinema={reloadCinema}
              readOnly={!isOwner}
            />
          );
        })}
      </Stack>
      <Box sx={{ display: 'flex', my: 4, justifyContent: 'center' }}>
        {isOwner ? (
          <>
            <Button
              variant="contained"
              color="error"
              onClick={() => navigate(AppRoute.ModCinemaList)}
              sx={{ mr: 2 }}
            >
              Back
            </Button>

            <Button
              variant="contained"
              //sx={{ width: '100px' }}
              onClick={() =>
                navigate(
                  replaceRouteParams(AppRoute.ModRoomCreate, {
                    cinemaId: cinema.id.toString(),
                  }),
                )
              }
            >
              Create room
            </Button>
          </>
        ) : null}
      </Box>
    </>
  );
};
