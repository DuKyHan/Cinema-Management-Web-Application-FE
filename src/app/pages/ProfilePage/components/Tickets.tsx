import { StarBorder } from '@mui/icons-material';
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import dayjs from 'dayjs';
import { TitleLine } from './TitleLine';

export const Tickets = (props: {
  tickets: { name: string; premiere: Date; price: number }[];
}) => {
  const { tickets } = props;
  return (
    <>
      <TitleLine title="Tickets" />
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {tickets.map((ticket, index) => {
          const price = `${ticket.price}$`;
          return (
            <ListItem key={index} secondaryAction={price}>
              <ListItemAvatar>
                <Avatar>
                  <StarBorder />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={ticket.name}
                secondary={dayjs(ticket.premiere).format('HH:mm - DD/MM/YYYY')}
              />
            </ListItem>
          );
        })}
      </List>
    </>
  );
};
