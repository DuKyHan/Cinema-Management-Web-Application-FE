import { RemoveRedEyeOutlined } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';
import { AppRoute, replaceRouteParams } from 'app/routes';
import logo from 'assets/images/news-placeholder.png';
import dayjs from 'dayjs';
import parse from 'html-react-parser';
import LinesEllipsis from 'react-lines-ellipsis';
import { Link } from 'react-router-dom';
import { News, NewsContentFormat } from 'types/news';
import { getImageUrl, getImageUrlOrDefault } from 'utils/get-image-url';
import { getProfileDisplayNameOrDefault } from 'utils/profile';

export const NewsCard = (props: {
  news: News;
  width?: number;
  imageHeight?: string | number;
  contentHeight?: string | number;
  showDescription?: boolean;
}) => {
  const { news, width, imageHeight, contentHeight, showDescription } = props;

  return (
    <Card sx={{ height: '100%' }}>
      <Link
        to={replaceRouteParams(AppRoute.News, { newsId: news.id.toString() })}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <CardMedia
          sx={{ height: imageHeight ?? 200 }}
          image={getImageUrl(news.thumbnail) ?? logo}
        />
        <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ height: contentHeight ?? '120px', overflow: 'hidden' }}>
            <Typography gutterBottom variant="h5" fontWeight={'bold'}>
              <LinesEllipsis text={news.title} maxLine={3}></LinesEllipsis>
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              fontWeight={'bold'}
            >
              {dayjs(news.publishedAt).format('MMM DD, YYYY')}
            </Typography>
            {showDescription ? (
              news.contentFormat === NewsContentFormat.Delta ? (
                parse(news.content)
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ my: 1 }}
                >
                  <LinesEllipsis text={news.content} maxLine={3}>
                    {news.content}
                  </LinesEllipsis>
                </Typography>
              )
            ) : null}
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 2,
              justifySelf: 'end',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                src={getImageUrlOrDefault(news.author?.avatarId)}
                sx={{ width: '30px', height: '30px' }}
              />
              <Typography>
                {getProfileDisplayNameOrDefault(news.author, 'Unknown author')}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <RemoveRedEyeOutlined />
              <Typography>{news.views}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Link>
    </Card>
  );
};
