import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { NavBarMod } from 'app/components/NavBar/NarBarMod';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Color } from 'app/types';
import { ListCard } from './components/ListCard';
export function FoodsPage() {
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  return (
    <>
      <Container maxWidth={'xl'} sx={{ mt: 1 }}>
        <Typography variant={'h4'} sx={{ my: 3 }}>
          Food and Beverage
        </Typography>
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
            options={['Draft', 'Published']}
            sx={{ width: 300 }}
            renderInput={params => <TextField {...params} label="Movie" />}
          />
          <Button
            sx={{
              backgroundColor: Color.blueButton,
              borderRadius: 3,
              px: 3,
              ml: 90,
              py: 0,
              height: 45,
            }}
          >
            <AddIcon htmlColor="white" sx={{ pr: 1 }} />
            <Typography color={'white'}>add</Typography>
          </Button>
          <Button
            sx={{
              backgroundColor: 'red',
              borderRadius: 3,
              px: 3,
              ml: 5,
              py: 0,
              height: 45,
            }}
          >
            <DeleteIcon htmlColor="white" sx={{ pr: 1 }} />
            <Typography color={'white'}>delete</Typography>
          </Button>
        </Box>
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
              Name
            </Grid>
            <Grid item xs={2}>
              Price
            </Grid>
            <Grid item xs={2}>
              Quantity
            </Grid>
            <Grid item xs={2}>
              Description
            </Grid>
            <Grid item xs={2}>
              Status
            </Grid>
            <Grid item xs={2}>
              Action
            </Grid>
          </Grid>
        </Box>
        <ListCard />
        <ListCard />
        <ListCard />
      </Container>
    </>
  );
}
