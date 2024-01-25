import { Box, Button, Checkbox, Typography } from '@mui/material';
import { Color } from 'app/types';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Avatar from '@mui/material/Avatar';
import { CinemaChangeItem } from './CinemaChangeItem';
import DoneIcon from '@mui/icons-material/Done';

export function CinemaChangeFrame() {
  return (
    <Box
      sx={{
        maxWidth: 800,
        borderRadius: 3,
        border: 1,
      }}
    >
      <Box
        display={'flex'}
        flexDirection={'row'}
        sx={{
          py: 3,
          px: 10,
          borderRadius: '0 0 3 3',
          borderBottom: 1,
        }}
      >
        <Typography variant="h4">Choose Cinema</Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: Color.blueButton,
            borderRadius: 3,
            px: 3,
            py: 0,
            ml: 10,
            height: 45,
          }}
        >
          <AddIcon htmlColor="white" sx={{ pr: 1 }} />
          <Typography color={'white'}>add</Typography>
        </Button>
        <Button
          sx={{
            backgroundColor: Color.blueButton,
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
        <CinemaChangeItem />
        <CinemaChangeItem />
        <CinemaChangeItem />
        <CinemaChangeItem />
      </Box>
      <Box
        display={'flex'}
        justifyContent={'center'}
        sx={{ borderTop: 1, py: 2 }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: Color.blueButton,
            borderRadius: 3,
            px: 3,
            py: 0,
            ml: 10,
            height: 45,
          }}
          onClick={() => {}}
        >
          <Typography color={'white'}>return</Typography>
        </Button>
        <Button
          variant="outlined"
          sx={{
            backgroundColor: 'red',
            borderRadius: 3,
            px: 3,
            ml: 5,
            py: 0,
            height: 45,
          }}
        >
          <DoneIcon htmlColor="white" sx={{ pr: 1 }} />
          <Typography color={'white'}>choose</Typography>
        </Button>
      </Box>
    </Box>
  );
}
