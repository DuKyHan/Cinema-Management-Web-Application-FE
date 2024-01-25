import {
  ConfirmationNumber,
  ExpandMore,
  LocationOn,
  Movie,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { AppBreadcrumbs } from 'app/components/AppBreadcrumbs/AppBreadcrumbs';
import { Loading } from 'app/components/Loading/Loading';
import { useGlobalDialogContext } from 'app/context/GlobalDialogContext';
import { AppRoute, replaceRouteParams } from 'app/routes';
import { getFilmPremiereById } from 'app/services/film';
import dayjs from 'dayjs';
import { getDistance } from 'geolib';
import Image from 'mui-image';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Cinema } from 'types/cinema';
import { ExtendedFilmPremiere } from 'types/film';
import { GOOGLE_MAPS_API_KEY } from 'utils/config';
import { requireNonNull } from 'utils/general';
import { getImageUrlOrDefault } from 'utils/get-image-url';
import { locationToString } from 'utils/location';

export class CinemaPremiere extends Cinema {
  premieres: {
    id: number;
    premiere: Date;
    cinemaFilmId: number;
    cinemaId: number;
  }[];
}

export const FilmPage = () => {
  const { filmId } = useParams();
  const navigate = useNavigate();

  const { showRawDialog, closeDialog } = useGlobalDialogContext();

  const [isLoadingFilm, setIsLoadingFilm] = useState(true);
  const [film, setFilm] = useState<ExtendedFilmPremiere | null>(null);

  const [location, setLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({ latitude: null, longitude: null });

  useEffect(() => {
    if (filmId != null) {
      getFilmPremiereById(filmId, {
        startDate: new Date(),
      }).then(res => {
        setFilm(res.data.data);
        console.log(res.data.data);
        setIsLoadingFilm(false);
      });
    }
  }, [filmId]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        console.log(error);
      },
    );
  });

  if (filmId == null || (!isLoadingFilm && film == null)) {
    return <Navigate to={AppRoute.NotFound} />;
  }

  if (isLoadingFilm) {
    return <Loading />;
  }

  const cinemaPremieres: CinemaPremiere[] = [];
  film?.premieres.forEach(premiere => {
    const cinemaId = premiere.cinemaId;
    if (cinemaPremieres[cinemaId] == null) {
      cinemaPremieres[cinemaId] = {
        ...film.cinemas.find(cinema => cinema.id === cinemaId)!,
        premieres: film.premieres.filter(p => p.cinemaId === cinemaId),
      };
    }
  });

  return (
    <>
      <AppBreadcrumbs
        templates={[
          {
            icon: <Movie sx={{ mr: 0.5 }} fontSize="inherit" />,
            href: AppRoute.FilmList,
            name: 'Film',
          },
        ]}
      />
      <Typography variant={'h4'} sx={{ my: 3 }}>
        {film!.name}
      </Typography>
      <Typography variant="h6" color="primary">
        Age rating: {film!.AgeRestricted}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Image
            src={getImageUrlOrDefault(film!.thumbnailId)}
            style={{ width: '300px', height: '450px' }}
            wrapperStyle={{
              justifyContent: 'start',
              height: undefined,
              marginTop: '24px',
              marginBottom: '24px',
            }}
          />
          <Typography fontWeight={'bold'}>Description</Typography>
          <Typography sx={{ mt: 1, mb: 2 }}>{film!.description}</Typography>
          <Typography fontWeight={'bold'}>Actors</Typography>
          <Typography sx={{ mt: 1, mb: 2 }}>
            {film!.actors!.join(', ')}
          </Typography>
          <Typography fontWeight={'bold'}>Genres</Typography>
          <Box sx={{ mt: 1, mb: 2 }}>
            {film?.genreNames?.map((genre, index) => {
              return (
                <Chip
                  variant="outlined"
                  key={index}
                  label={genre}
                  sx={{ mr: 1 }}
                />
              );
            })}
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Typography variant={'h6'} sx={{ my: 3 }} fontWeight={'bold'}>
            Trailer
          </Typography>
          <iframe
            width="560"
            height="315"
            src={film!.TrailerLink}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
          <Typography variant={'h6'} sx={{ mt: 6, mb: 3 }} fontWeight={'bold'}>
            Cinemas
          </Typography>
          {cinemaPremieres.map((cinemaPremiere, index) => {
            return (
              <Accordion key={index}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Stack direction={'row'} gap={2}>
                    <ConfirmationNumber />
                    <Box>
                      <Typography fontWeight={'bold'}>
                        {cinemaPremiere.name}
                      </Typography>
                      <Typography>
                        {locationToString(cinemaPremiere.location)}
                      </Typography>
                    </Box>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <Stack direction={'row'} spacing={2}>
                      {cinemaPremiere.premieres.map((premiere, index) => (
                        <Chip
                          color="primary"
                          key={index}
                          label={dayjs(premiere.premiere).format(
                            'DD/MM/YYYY HH:mm',
                          )}
                          sx={{ mr: 1 }}
                          onClick={() => {
                            navigate(
                              replaceRouteParams(AppRoute.Ticket, {
                                cinemaFilmId: premiere.cinemaFilmId.toString(),
                                premiereId: premiere.id.toString(),
                              }),
                            );
                          }}
                        />
                      ))}
                    </Stack>
                    <Button
                      disabled={
                        cinemaPremiere.location.latitude == null ||
                        cinemaPremiere.location.longitude == null
                      }
                      variant="outlined"
                      startIcon={<LocationOn />}
                      onClick={() => {
                        showRawDialog({
                          disableBackdropClick: true,
                          fullWidth: true,
                          maxWidth: 'md',
                          title: `Cinema ${cinemaPremiere.name}'s location`,
                          content: (
                            <>
                              <Typography>
                                {location.latitude != null &&
                                location.longitude != null &&
                                cinemaPremiere.location.latitude != null &&
                                cinemaPremiere.location.longitude != null ? (
                                  <Typography sx={{ mb: 2, ml: 3 }}>
                                    {getDistance(
                                      {
                                        latitude:
                                          cinemaPremiere.location.latitude!,
                                        longitude:
                                          cinemaPremiere.location.longitude!,
                                      },
                                      {
                                        latitude: location.latitude!,
                                        longitude: location.longitude!,
                                      },
                                    ) / 1000}{' '}
                                    km from your location
                                  </Typography>
                                ) : null}
                              </Typography>
                              <APIProvider
                                apiKey={requireNonNull(GOOGLE_MAPS_API_KEY)}
                              >
                                <Box sx={{ height: '500px' }}>
                                  <Map
                                    zoom={17}
                                    center={{
                                      lat: cinemaPremiere.location.latitude!,
                                      lng: cinemaPremiere.location.longitude!,
                                    }}
                                    gestureHandling={'greedy'}
                                    disableDefaultUI={true}
                                  >
                                    <Marker
                                      position={{
                                        lat: cinemaPremiere.location.latitude!,
                                        lng: cinemaPremiere.location.longitude!,
                                      }}
                                    />
                                  </Map>
                                </Box>
                              </APIProvider>
                              <Stack alignItems={'end'} sx={{ m: 2 }}>
                                <Button
                                  variant="contained"
                                  color="error"
                                  onClick={() => closeDialog()}
                                >
                                  Close
                                </Button>
                              </Stack>
                            </>
                          ),
                        });
                      }}
                    >
                      Show location
                    </Button>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Grid>
      </Grid>
    </>
  );
};
