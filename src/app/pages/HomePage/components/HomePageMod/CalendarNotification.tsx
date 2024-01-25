import { ClearOutlined, InfoOutlined } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { Film } from 'types/film';

export const CalendarNotification = (props: { film: Film }) => {
  return (
    <Box
      sx={{
        backgroundColor: '#FFDC5F',
        p: 2,
        borderRadius: 4,
      }}
    >
      <Box sx={{ display: 'flex' }}>
        <InfoOutlined />
        <Box sx={{ flexGrow: 1, mx: 1 }}>
          <Typography>
            Your purchased upcoming movie premiere tomorrow
          </Typography>
          <Typography sx={{ fontWeight: 'bold' }}>{props.film.name}</Typography>
        </Box>
        <ClearOutlined />
      </Box>
    </Box>
  );
};
