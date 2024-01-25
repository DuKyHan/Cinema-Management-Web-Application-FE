import { Box, Button, Grid, Typography } from '@mui/material';
import { Loading } from 'app/components/Loading/Loading';
import { getNews, NewsInclude, NewsSort } from 'app/services/news';
import { useEffect, useState } from 'react';
import { News } from 'types/news';
import { NewsCard } from './NewsCard';

export const PopularNewsSection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [popularNews, setPopularNews] = useState<News[]>([]);

  useEffect(() => {
    getNews({
      sort: NewsSort.PopularityDesc,
      includes: [NewsInclude.Author],
    }).then(res => {
      setPopularNews(res.data.data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Grid item container xs={6} rowSpacing={2} spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h5">Popular</Typography>
          <Button>See more</Button>
        </Box>
      </Grid>
      {popularNews.slice(0, 3).map((news, i) => {
        return (
          <Grid key={i} item xs={i === 0 ? 12 : 6}>
            <NewsCard
              news={news}
              showDescription={i === 0}
              contentHeight={i === 0 ? '200px' : undefined}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};
