import { Box, Button, Grid, Typography } from '@mui/material';
import { Loading } from 'app/components/Loading/Loading';
import { getNews, NewsInclude, NewsSort } from 'app/services/news';
import { useEffect, useState } from 'react';
import { News } from 'types/news';
import { NewsCard } from './NewsCard';

export const LatestNewsSection = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    getNews({
      sort: NewsSort.DateDesc,
      includes: [NewsInclude.Author],
    }).then(res => {
      setNews(res.data.data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Grid item container xs={6} spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h5">Latest news</Typography>
          <Button>See more</Button>
        </Box>
      </Grid>
      {news.slice(0, 4).map((news, i) => {
        return (
          <Grid key={i} item xs={6}>
            <NewsCard news={news} showDescription={false} />
          </Grid>
        );
      })}
    </Grid>
  );
};
