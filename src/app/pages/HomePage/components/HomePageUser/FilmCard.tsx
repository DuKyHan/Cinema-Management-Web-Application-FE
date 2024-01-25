import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { Film } from 'types/film';
import KeAnHon from '../../assets/KeAnHon.jpg';

export const FilmCard = (props: { film: Film }) => {
  const { film } = props;

  // Limit description to 100 characters
  const description =
    film.description.length > 130
      ? film.description.substring(0, 130) + '...'
      : film.description;

  return (
    <Card sx={{ maxWidth: 310 }} raised>
      <Box>
        <CardMedia
          sx={{ height: 200, borderRadius: 4, zIndex: 0, position: 'relative' }}
          image={KeAnHon}
          title="green iguana"
        >
          <Box
            sx={{
              position: 'absolute',
              zIndex: 1,
              backgroundColor: 'white',
              bottom: 8,
              right: 8,
              p: 1,
            }}
          >
            <Typography variant="body2">
              Premiere day: {dayjs().format('MMM DD')}
            </Typography>
          </Box>
        </CardMedia>
      </Box>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {film.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          {/* {film.filmTypes.map((filmType, index) => {
            return (
              <span key={index}>
                {filmType}
                {index < film.filmTypes.length - 1 ? ', ' : ''}
              </span>
            );
          })} */}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Duration: {film.duration.toString()} minutes
        </Typography>
      </CardContent>

      <CardActions>
        <Button size="small">Detail</Button>
        <Button variant="contained" size="small">
          Buy
        </Button>
      </CardActions>
    </Card>
  );
};
