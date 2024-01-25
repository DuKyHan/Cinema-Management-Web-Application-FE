import { Box, Button, Grid, Typography } from '@mui/material';
import { NewsCard } from 'app/pages/NewsListPage/components/NewsCard';
import { useNavigate } from 'react-router-dom';
import { News } from 'types/news';

export const NewsListWithTitle = (props: {
  title: string;
  news: News[];
  newsPerLine?: number;
  maxNews?: number;
  onClickSeeMore?: () => void;
}) => {
  const navigate = useNavigate();
  const { title, news, newsPerLine, maxNews, onClickSeeMore } = props;

  return (
    <Box sx={{ my: 4 }}>
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
        <Button onClick={onClickSeeMore}>See more</Button>
      </Box>

      {news.length > 0 ? (
        <Grid container spacing={4} sx={{ mt: 1 }}>
          {news.slice(0, maxNews ?? news.length).map((n, i) => {
            return (
              <Grid
                item
                key={i}
                xs={newsPerLine != null ? 12 / newsPerLine : 4}
              >
                <NewsCard news={n} />
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Typography variant={'h6'} sx={{ my: 1, height: '200px' }}>
          No news
        </Typography>
      )}
    </Box>
  );
};
