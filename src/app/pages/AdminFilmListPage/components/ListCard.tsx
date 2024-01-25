import { Box, Button, Checkbox, Grid, Typography } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import { Color } from 'app/types';
export function ListCard() {
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  return (
    <Box>
      <Grid
        container
        sx={{ pt: 3, pb: 1 }}
        display={'flex'}
        alignItems={'center'}
        borderBottom={1}
      >
        <Grid item xs={2}>
          <Checkbox {...label} />
          Morning Shift
        </Grid>
        <Grid item xs={2}>
          7/1/2022 07:00
        </Grid>
        <Grid item xs={2}>
          Bucharest, RO
        </Grid>
        <Grid item xs={2}>
          Description
        </Grid>
        <Grid item xs={2}>
          Draft
        </Grid>
        <Grid item xs={2}>
          <Button
            sx={{
              borderRadius: 3,
              px: 3,
              py: 0,
              height: 45,
            }}
          >
            <CreateIcon htmlColor={Color.blueButton} sx={{ pr: 1 }} />
            <Typography color={Color.blueButton}>edit</Typography>
          </Button>
          <Button
            sx={{
              borderRadius: 3,
              px: 3,
              py: 0,
              height: 45,
            }}
          >
            <DeleteIcon htmlColor="red" sx={{ pr: 1 }} />
            <Typography color={'red'}>delete</Typography>
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
