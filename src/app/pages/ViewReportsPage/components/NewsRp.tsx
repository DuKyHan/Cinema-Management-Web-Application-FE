import { Box, Checkbox, Grid } from '@mui/material';
import { FilmCard } from './FilmCard';
import { NewsCard } from './NewsCard';

export function NewsRp() {
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
            News
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
        <NewsCard />
        <NewsCard />
        <NewsCard />
      </Box>
    </Box>
  );
}
