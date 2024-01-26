import { ClearOutlined, Send } from '@mui/icons-material';
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { useAuth } from 'app/context/AuthContext';
import { MutableRefObject, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Socket } from 'socket.io-client';
import { getProfileDisplayNameOrDefault } from 'utils/profile';
import { socket } from 'utils/socket';
import { ExtendedChat, MESSAGES_LIMIT } from '..';
import { getChatMessages } from '../services/chat';
import { sendMessage } from '../services/socket';
import { ChatMessage } from './ChatMessage';

export const ChatSection = (props: {
  socket: Socket;
  chat: ExtendedChat;
  scrollToRef: MutableRefObject<unknown>;
  updateNewChat: (chat: ExtendedChat) => void;
}) => {
  const { chat, scrollToRef, updateNewChat } = props;
  const [message, setMessage] = useState('');

  const { account } = useAuth();

  const myParticipant = chat.participants.find(p => p.id === account!.id)!;
  const otherParticipant = chat.participants.find(p => p.id !== account!.id)!;

  const chatMessages = chat.messages;
  const offset = chat.offset;

  return (
    <>
      <Typography variant="h5" fontWeight={'bold'} sx={{ ml: 2 }}>
        {getProfileDisplayNameOrDefault(
          otherParticipant,
          otherParticipant.email,
        )}
      </Typography>
      <Box
        id="message-list"
        sx={{
          display: 'flex',
          flexDirection: 'column-reverse',
          overflowY: 'scroll',
          height: '70vh',
        }}
      >
        <InfiniteScroll
          dataLength={chatMessages.length}
          next={() => {
            console.log(offset);
            getChatMessages(chat.id, { limit: MESSAGES_LIMIT, offset }).then(
              res => {
                chat.messages = [...res.data.data.reverse(), ...chat.messages];
                const hasMore = res.data.data.length >= MESSAGES_LIMIT;
                updateNewChat({
                  ...chat,
                  hasMore,
                  offset: offset + MESSAGES_LIMIT,
                });
              },
            );
          }}
          loader={<CircularProgress />}
          hasMore={chat.hasMore}
          inverse={true}
          scrollableTarget="message-list"
        >
          {chat.messages.map((message, i) => {
            const primary = message.sender === myParticipant.participantId;
            const participant = primary ? myParticipant : otherParticipant;

            return (
              <ChatMessage
                key={i}
                participant={participant}
                message={message.message}
                primary={primary}
              />
            );
          })}
        </InfiniteScroll>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mx: 2, pt: 2 }}>
        <OutlinedInput
          placeholder="Type your message..."
          sx={{ flexGrow: 1 }}
          onChange={e => setMessage(e.target.value.trim())}
          value={message}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setMessage('')}
              >
                <ClearOutlined />
              </IconButton>
            </InputAdornment>
          }
        />
        <Box ref={scrollToRef} />
        <IconButton
          disabled={message.trim().length === 0}
          onClick={() => {
            sendMessage(socket, { chatId: chat.id, message }).then(res => {
              console.log(res);
            });
            setMessage('');
          }}
        >
          <Send />
        </IconButton>
      </Box>
    </>
  );
};
