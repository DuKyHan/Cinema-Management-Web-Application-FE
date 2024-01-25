import { ArrowRightOutlined, NewspaperOutlined } from '@mui/icons-material';
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import { TitleLine } from './TitleLine';

export const News = (props: {
  news: { title: string; filmName: string }[];
}) => {
  const { news } = props;

  return (
    <>
      <TitleLine title="News" />
      <List>
        {news.map((news, index) => {
          return (
            <ListItem key={index} secondaryAction={<ArrowRightOutlined />}>
              <ListItemAvatar>
                <Avatar>
                  <NewspaperOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={news.title} secondary={news.filmName} />
            </ListItem>
          );
        })}
      </List>
    </>
  );
};
