import { CalendarMonth } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from '@mui/material';
import { AppRoute, replaceRouteParams } from 'app/routes';
import logo from 'assets/images/news-placeholder.png';
import dayjs from 'dayjs';
import LinesEllipsis from 'react-lines-ellipsis';
import { Link } from 'react-router-dom';
import { FilmPremiere } from 'types/film';
import { getImageUrl } from 'utils/get-image-url';

export const FilmCard = (props: {
  film: FilmPremiere;
  width?: number;
  height?: number;
}) => {
  const { film, height } = props;

  return (
    <Card sx={{ height: '100%' }}>
      <Link
        to={replaceRouteParams(AppRoute.Film, { filmId: film.id.toString() })}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <CardMedia
          sx={{ height: height ?? 600 }}
          image={getImageUrl(film.thumbnailId) ?? logo}
        />
        <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ height: '150px' }}>
            <Typography gutterBottom variant="h5" fontWeight={'bold'}>
              <LinesEllipsis text={film.name} maxLine={2}></LinesEllipsis>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
              <LinesEllipsis text={film.description} maxLine={3}>
                {film.description}
              </LinesEllipsis>
            </Typography>
          </Box>

          <Stack direction={'row'} alignItems="center" gap={1}>
            <CalendarMonth />
            <Typography variant="body2">
              Starting from {dayjs(film.firstPremiere).format('DD/MM/YYYY')}
            </Typography>
          </Stack>
        </CardContent>
      </Link>
    </Card>
  );
};
