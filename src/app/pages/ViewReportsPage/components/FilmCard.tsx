import { Checkbox, Grid } from '@mui/material';

export function FilmCard() {
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  return (
    <Grid
      container
      sx={{ pt: 3, pb: 1, fontWeight: '200', borderColor: 'gray' }}
      display={'flex'}
      alignItems={'center'}
      borderBottom={1}
    >
      <Grid item xs={3}>
        <Checkbox {...label} />
        Report User
      </Grid>
      <Grid item xs={3}>
        FilmName
      </Grid>
      <Grid item xs={3}>
        Time
      </Grid>
      <Grid item xs={3}>
        Description
      </Grid>
    </Grid>
  );
}
