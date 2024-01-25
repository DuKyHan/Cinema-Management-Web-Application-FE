import { InfoOutlined } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { Ticket } from 'types/ticket';

export const CalendarNotification = (props: { ticket: Ticket }) => {
  const { ticket } = props;

  return (
    <Box
      sx={{
        backgroundColor: '#FFDC5F',
        p: 2,
        borderRadius: 4,
        //width: '320px',
        mx: '17%',
      }}
    >
      <Box sx={{ display: 'flex' }}>
        <InfoOutlined />
        <Box sx={{ flexGrow: 1, mx: 1 }}>
          <Typography>
            Your purchased upcoming movie premiere on{' '}
            {dayjs(ticket.premiere).format('DD/MM/YYYY HH:mm')}
          </Typography>
          <Typography sx={{ fontWeight: 'bold' }}>
            {ticket.film!.name}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
