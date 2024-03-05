import { Box, Stack, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts';
import { Loading } from 'app/components/Loading/Loading';
import {
  getFilmById,
  getFilmRevenue,
  getFilmRevenueByCinema,
  getFilmScreenings,
  getFilmScreeningsByCinema,
} from 'app/services/film';
import Image from 'mui-image';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Film,
  FilmRevenueGroupByCinema,
  FilmScreeningsGroupByCinema,
} from 'types/film';
import { getImageUrlOrDefault } from 'utils/get-image-url';
import { NotFoundPage } from '../NotFoundPage';

export const AdminFilmRevenueAnalyticsPage = () => {
  const { filmId } = useParams();

  const [isFilmLoading, setIsFilmLoading] = useState(true);
  const [isRevenueLoading, setIsRevenueLoading] = useState(true);
  const [isScreeningsLoading, setIsScreeningsLoading] = useState(true);
  const [isRevenueByCinemaLoading, setIsRevenueByCinemaLoading] =
    useState(true);
  const [isScreeningsByCinemaLoading, setIsScreeningsByCinemaLoading] =
    useState(true);
  const [film, setFilm] = useState<Film | null>(null);
  const [revenue, setRevenue] = useState(0);
  const [screenings, setScreenings] = useState(0);
  const [revenueByCinema, setRevenueByCinema] =
    useState<FilmRevenueGroupByCinema[]>();
  const [screeningsByCinema, setScreeningsByCinema] =
    useState<FilmScreeningsGroupByCinema[]>();

  useEffect(() => {
    if (filmId) {
      getFilmById(filmId).then(res => {
        setFilm(res.data.data);
        setIsFilmLoading(false);
      });
      getFilmRevenue(filmId).then(res => {
        setRevenue(res.data.data);
        setIsRevenueLoading(false);
      });
      getFilmScreenings(filmId).then(res => {
        setScreenings(res.data.data);
        setIsScreeningsLoading(false);
      });
      getFilmRevenueByCinema(filmId).then(res => {
        setRevenueByCinema(res.data.data);
        setIsRevenueByCinemaLoading(false);
      });
      getFilmScreeningsByCinema(filmId).then(res => {
        setScreeningsByCinema(res.data.data);
        setIsScreeningsByCinemaLoading(false);
      });
    } else {
      setIsFilmLoading(false);
    }
  }, [filmId]);

  if (
    isFilmLoading ||
    isRevenueLoading ||
    isScreeningsLoading ||
    isRevenueByCinemaLoading
  )
    return <Loading />;

  if (!film) return <NotFoundPage />;

  return (
    <>
      <Stack direction={'row'} spacing={4}>
        <Image src={getImageUrlOrDefault(film?.thumbnailId)} width={'10%'} />
        <Box>
          <Typography variant={'h4'}>{film?.name}</Typography>
          <Stack spacing={2} mt={4}>
            <Typography>Revenue: {revenue}</Typography>
            <Typography>Screenings: {screenings}</Typography>
          </Stack>
        </Box>
      </Stack>
      <Stack direction={'row'} width={'100%'} textAlign={'center'} mt={6}>
        <Box flexGrow={1}>
          <PieChart
            series={[
              {
                data: revenueByCinema!.map(data => ({
                  id: data.id,
                  value: data.revenue,
                  label: data.name,
                })),
              },
            ]}
            width={700}
            height={300}
            margin={{ top: 30, bottom: 30 }}
          />
          <Typography fontWeight={'bold'}>Revenue</Typography>
        </Box>
        <Box flexGrow={1}>
          <PieChart
            series={[
              {
                data: screeningsByCinema!.map(data => ({
                  id: data.id,
                  value: data.screenings,
                  label: data.name,
                })) ?? [
                  { id: 0, value: 10, label: 'series A' },
                  { id: 1, value: 15, label: 'series B' },
                  { id: 2, value: 20, label: 'series C' },
                ],
              },
            ]}
            width={700}
            height={300}
            margin={{ top: 30, bottom: 30}}
          />
          <Typography fontWeight={'bold'}>Screening</Typography>
        </Box>
      </Stack>
    </>
  );
};
