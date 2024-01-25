import { Box, Button, Grid, Typography } from '@mui/material';
import { FilmCard } from 'app/pages/FilmListPage/components/FilmCard';
import { useNavigate } from 'react-router-dom';
import { FilmPremiere } from 'types/film';

export const FilmListWithTitle = (props: {
  title: string;
  films: FilmPremiere[];
  noFilmMessage: string;
  filmPerLine?: number;
  maxFilms?: number;
  onClickSeeMore?: () => void;
}) => {
  const navigate = useNavigate();
  const { title, films, filmPerLine, maxFilms, onClickSeeMore } = props;

  return (
    <Box sx={{ my: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          my: 1,
        }}
      >
        <Typography variant={'h5'} sx={{ my: 1, fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Button onClick={onClickSeeMore}>See more</Button>
      </Box>

      {films.length > 0 ? (
        <Grid container spacing={4} sx={{ mt: 1 }}>
          {films.slice(0, maxFilms ?? films.length).map((film, i) => {
            return (
              <Grid item key={i} xs={filmPerLine ? 12 / filmPerLine : 4}>
                <FilmCard film={film} height={300} />
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Typography variant={'h6'} sx={{ my: 1, height: '200px' }}>
          {props.noFilmMessage}
        </Typography>
      )}
    </Box>
  );
};
