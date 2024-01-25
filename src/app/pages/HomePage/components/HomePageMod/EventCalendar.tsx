import { Box, Button, Typography } from '@mui/material';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { CalendarNotification } from './CalendarNotification';

export const EventCalendar = () => {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          my: 1,
        }}
      >
        <Typography variant={'h5'} sx={{ my: 1, fontWeight: 'bold' }}>
          Event calendar
        </Typography>
        <Button>See tickets</Button>
      </Box>
      <CalendarNotification
        film={{
          id: 1,
          name: 'Kẻ Ăn Hồn',
          description:
            'Phim về hàng loạt cái chết bí ẩn ở Làng Địa Ngục, nơi có ma thuật cổ xưa: 5 mạng đổi bình Rượu Sọ Người. Thập Nương - cô gái áo đỏ là kẻ nắm giữ bí thuật luyện nên loại rượu mạnh nhất!',
          duration: 120,
          AgeRestricted: '18',
          TrailerLink: 'https://www.youtube.com/watch?v=xWh0g4rKGjI',
          cinemaId: 1,
          thumbnailId: 1,
          //filmTypes: ['Kinh dị'],
          actors: [
            'Ngô Kiến Huy',
            'Thu Trang',
            'Tiến Luật',
            'Trấn Thành',
            'Trường Giang',
            'Việt Hương',
          ],
        }}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          defaultValue={dayjs()}
          readOnly
          sx={{ backgroundColor: '#EEE8F4', borderRadius: 4 }}
        />
      </LocalizationProvider>
    </>
  );
};
