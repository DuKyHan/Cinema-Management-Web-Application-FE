import DeleteIcon from '@mui/icons-material/Delete';
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { NewsRp } from './components/NewsRp';
export function ViewReportsPage() {
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  const waitingReq: { userN: number; filmN: number; newsN: number } = {
    userN: 3,
    filmN: 4,
    newsN: 6,
  };
  return (
    <Container maxWidth={'xl'} sx={{ mt: 1, fontWeight: '700' }}>
      <Typography variant={'h4'} sx={{ my: 3 }}>
        Report Management
      </Typography>
      <Typography variant={'h6'}>View and manage user report</Typography>
      <Grid container sx={{ my: 10 }}>
        <Grid item xs={2}></Grid>
        <Grid
          item
          xs={3}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'gray',
            padding: 5,
          }}
        >
          <Typography
            sx={{
              borderBottom: 1,
              color: 'blue',
              width: '30%',
              textAlign: 'center',
            }}
          >
            User ({waitingReq.userN})
          </Typography>
        </Grid>
        <Grid
          item
          xs={3}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'gray',
            padding: 5,
          }}
        >
          <Typography
            sx={{
              borderBottom: 1,
              color: 'blue',
              width: '30%',
              textAlign: 'center',
            }}
          >
            Films ({waitingReq.filmN})
          </Typography>
        </Grid>
        <Grid
          item
          xs={3}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'gray',
            padding: 5,
          }}
        >
          <Typography
            sx={{
              borderBottom: 1,
              color: 'blue',
              width: '30%',
              textAlign: 'center',
            }}
          >
            News ({waitingReq.newsN})
          </Typography>
        </Grid>
      </Grid>
      <Box
        display={'flex'}
        flexDirection={'row'}
        alignItems={'center'}
        sx={{ mt: 10 }}
      >
        <TextField
          id="outlined-multiline-flexible"
          label="Search"
          sx={{ width: 300, mr: 2 }}
        />
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={['User', 'Mod']}
          sx={{ width: 300 }}
          renderInput={params => <TextField {...params} label="Role" />}
        />
        <Button
          sx={{
            backgroundColor: 'red',
            borderRadius: 3,
            px: 3,
            ml: 90,
            py: 0,
            height: 45,
          }}
        >
          <DeleteIcon htmlColor="white" sx={{ pr: 1 }} />
          <Typography color={'white'}>delete</Typography>
        </Button>
      </Box>
      <NewsRp />
    </Container>
  );
}
