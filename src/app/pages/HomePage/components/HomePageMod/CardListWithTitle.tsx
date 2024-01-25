import { Box, Button, Typography } from '@mui/material';
import { FilmCard } from './FilmCard';

export const CardListWithTitle = ({ title, children }) => {
  const card = (
    <FilmCard
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
  );

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          my: 1,
        }}
      >
        <Typography variant={'h5'} sx={{ my: 1, fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Button>See more</Button>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        {card}
        {card}
        {card}
      </Box>
    </Box>
  );
};
