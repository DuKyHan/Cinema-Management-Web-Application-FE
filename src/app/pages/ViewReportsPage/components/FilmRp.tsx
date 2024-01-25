import { Box, Checkbox, Grid } from '@mui/material';
import { FilmCard } from './FilmCard';

export function FilmRp() {
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  return (
    <Box>
      <Box>
        <Grid
          container
          sx={{ pt: 3, pb: 1, borderColor: 'gray' }}
          display={'flex'}
          alignItems={'center'}
          borderBottom={1}
        >
          <Grid item xs={3}>
            <Checkbox {...label} />
            Report User
          </Grid>
          <Grid item xs={3}>
            Film
          </Grid>
          <Grid item xs={3}>
            Time
          </Grid>
          <Grid item xs={3}>
            Description
          </Grid>
        </Grid>
      </Box>
      <Box>
        <FilmCard />
        <FilmCard />
        <FilmCard />
      </Box>
    </Box>
  );
}
