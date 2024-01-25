import { Box, Typography } from '@mui/material';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import dayjs from 'dayjs';
import { getDistance } from 'geolib';
import { useEffect, useState } from 'react';
import { CinemaFilm } from 'types/cinema-film';
import { CinemaFilmPremiere } from 'types/cinema-film-premiere';
import { GOOGLE_MAPS_API_KEY } from 'utils/config';
import { alphabetNumberFromRowColumn, requireNonNull } from 'utils/general';
import { locationToString } from 'utils/location';
import { SeatData } from '..';

export const FilmInfo = (props: {
  cinemaFilm: CinemaFilm;
  cinemaFilmPremiere: CinemaFilmPremiere;
  seat: SeatData | null;
  trailingElement?: JSX.Element;
  showMap?: boolean;
}) => {
  const { cinemaFilm, cinemaFilmPremiere, seat, trailingElement, showMap } =
    props;
  const [currentLocation, setCurrentLocation] =
    useState<GeolocationPosition | null>(null);

  const location = cinemaFilm.cinema!.location;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        console.log(position);
        setCurrentLocation(position);
      },
      undefined,
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  }, []);

  return (
    <Box>
      <Typography variant={'h6'}>{cinemaFilm.film!.name}</Typography>
      <Typography color="primary">
        Session: {dayjs(cinemaFilmPremiere.premiere).format('DD/MM/YYYY HH:mm')}
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Cinema:{' '}
        {`${cinemaFilm.cinema!.name} | ${locationToString(
          cinemaFilm.cinema!.location,
        )}`}
      </Typography>
      {seat != null ? (
        <>
          <Typography fontWeight={'bold'}>
            Seat: {alphabetNumberFromRowColumn(seat.seat.row, seat.seat.column)}
            . Price: {seat.cinemaFilmSeat.price} VND
          </Typography>
        </>
      ) : null}
      {trailingElement}
      {currentLocation && location.latitude && location.longitude ? (
        <Typography sx={{ mb: 2 }}>
          {getDistance(
            {
              latitude: location.latitude!,
              longitude: location.longitude!,
            },
            {
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            },
          ) / 1000}{' '}
          km from your location
        </Typography>
      ) : null}
      {showMap && location.latitude && location.longitude ? (
        <APIProvider apiKey={requireNonNull(GOOGLE_MAPS_API_KEY)}>
          <Box sx={{ height: '300px' }}>
            <Map
              zoom={17}
              center={{ lat: location.latitude!, lng: location.longitude! }}
              gestureHandling={'greedy'}
              disableDefaultUI={true}
            >
              <Marker
                position={{ lat: location.latitude!, lng: location.longitude! }}
              />
            </Map>
          </Box>
        </APIProvider>
      ) : null}
    </Box>
  );
};
