import { RemoveRedEyeOutlined, ReportOutlined } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { Loading } from 'app/components/Loading/Loading';
import {
  NewsSort,
  getNews,
  getNewsById,
  newsIncludes,
  readNews,
} from 'app/services/news';
import NewsPlaceholder from 'assets/images/news-placeholder.png';
import dayjs from 'dayjs';
import parse from 'html-react-parser';
import Image from 'mui-image';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { News, NewsContentFormat } from 'types/news';
import { getImageUrl, getImageUrlOrDefault } from 'utils/get-image-url';
import { getProfileDisplayNameOrDefault } from 'utils/profile';
import { NewsCard } from '../NewsListPage/components/NewsCard';

export const NewsPage = () => {
  const params = useParams();
  const newsId = params.newsId;

  const [isLoading, setIsLoading] = useState(true);
  const [isPopularNewsLoading, setIsPopularNewsLoading] = useState(true);
  const [news, setNews] = useState<News | null>(null);
  const [popularNews, setPopularNews] = useState<News[]>([]);

  useEffect(() => {
    getNewsById(newsId!, {
      includes: newsIncludes,
    }).then(res => {
      setNews(res.data.data);
      setIsLoading(false);
    });

    getNews({
      excludeIds: [parseInt(newsId!)],
      limit: 3,
      includes: newsIncludes,
      sort: NewsSort.PopularityDesc,
    }).then(res => {
      setPopularNews(res.data.data);
      setIsPopularNewsLoading(false);
    });

    readNews(newsId!);
  }, [newsId]);

  if (isLoading) {
    return <Loading />;
  }

  if (news == null) {
    return <Typography variant="h4">News not found</Typography>;
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={9}>
        <Typography variant="h5">News</Typography>
        <Typography variant="h4" sx={{ my: 1 }}>
          {news.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {dayjs(news.publishedAt).format('MMM DD, YYYY')}
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          sx={{ my: 1 }}
        >
          <Stack direction={'row'} alignItems="center" gap={1}>
            <Avatar
              src={getImageUrlOrDefault(news.author?.avatarId)}
              sx={{ width: '30px', height: '30px' }}
            />
            <Typography>
              {getProfileDisplayNameOrDefault(news.author, 'Unknown author')}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" gap={1}>
            <IconButton>
              <ReportOutlined />
            </IconButton>
            <RemoveRedEyeOutlined />
            <Typography>{news.views}</Typography>
          </Stack>
        </Stack>
        <Box sx={{ my: 6 }}>
          <Image
            src={getImageUrl(news.thumbnail) ?? NewsPlaceholder}
            height={'400px'}
            fit={'contain'}
            showLoading
          />
        </Box>
        {news.contentFormat === NewsContentFormat.Delta ? (
          parse(news.content)
        ) : (
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {news.content}
          </Typography>
        )}
      </Grid>
      <Grid item xs={3}>
        <Typography variant="h5" sx={{ my: 2 }}>
          Other News
        </Typography>
        {isPopularNewsLoading ? (
          <Loading />
        ) : (
          <Stack gap={2}>
            {popularNews.map((news, index) => (
              <NewsCard key={index} news={news} />
            ))}
          </Stack>
        )}
      </Grid>
    </Grid>
  );
};
