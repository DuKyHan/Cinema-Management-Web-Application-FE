import { Avatar, Box, Checkbox, Typography } from '@mui/material';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
export function CinemaChangeItem() {
  return (
    <Box
      display={'flex'}
      flexDirection={'row'}
      justifyContent={'space-between'}
      alignItems={'center'}
      maxWidth={800}
      sx={{ my: 3 }}
    >
      <Box display={'flex'} flexDirection={'row'}>
        <Avatar sx={{ bgcolor: 'blue', ml: 2 }} variant="square">
          N
        </Avatar>
        <Box sx={{ ml: 2 }}>
          <Typography>The helpers</Typography>
          <Typography>Currently selected</Typography>
        </Box>
      </Box>
      <Box>
        <Typography>Status: </Typography>
      </Box>
      <Box>
        <Checkbox
          icon={<RadioButtonUncheckedIcon />}
          checkedIcon={<RadioButtonCheckedIcon />}
        />
      </Box>
    </Box>
  );
}
