import { Avatar, Box, Card, Typography } from '@mui/material';
import { Participant } from 'types/chat';
import { getImageUrlOrDefault } from 'utils/get-image-url';

export const ChatMessage = (props: {
  participant: Participant;
  message: string;
  primary: boolean;
}) => {
  const { participant, message, primary } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        my: 2,
        width: '100%',
        flexDirection: primary ? 'row-reverse' : 'row',
      }}
    >
      <Avatar src={getImageUrlOrDefault(participant.avatarId)} />
      <Card
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 1,
          backgroundColor: primary ? 'dodgerblue' : undefined,
        }}
      >
        <Typography color={primary ? 'white' : undefined}>{message}</Typography>
      </Card>
    </Box>
  );
};
