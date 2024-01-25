import { Box, Checkbox, Grid } from '@mui/material';
import { UserCard } from './UserCard';

export function UserRp() {
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
            Reported User
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
        <UserCard />
        <UserCard />
        <UserCard />
      </Box>
    </Box>
  );
}
