import { Add, Search } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { ErrorComponent } from 'app/components/Error/Error';
import { Loading } from 'app/components/Loading/Loading';
import { useAuth } from 'app/context/AuthContext';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { Chat, Message } from 'types/chat';
import { getImageUrlOrDefault } from 'utils/get-image-url';
import { getProfileDisplayNameOrDefault } from 'utils/profile';
import { socket } from 'utils/socket';
import { AddContactModal } from './components/AddContactModal';
import { ChatSection } from './components/ChatSection';
import { ChatQuerySort, getChats } from './services/chat';

export const MESSAGES_LIMIT = 10;

export class ExtendedChat extends Chat {
  offset: number;
  hasMore: boolean;
}

export const ChatPage = pros => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chats, setChats] = useState<ExtendedChat[]>([]);

  const [currentChatId, setCurrentChatId] = useState<number | null>(null);

  const [openModal, setOpenModal] = useState(false);

  const { account } = useAuth();

  const scrollToRef = useRef();

  useEffect(() => {
    getChats({
      messageLimit: MESSAGES_LIMIT,
      sort: ChatQuerySort.UpdatedAtDesc,
    })
      .then(res => {
        const chats: Chat[] = res.data.data;
        setChats(
          chats.map(c => ({
            ...c,
            offset: MESSAGES_LIMIT,
            hasMore: c.messages.length >= MESSAGES_LIMIT,
            messages: c.messages.reverse(),
          })),
        );
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.response.data.error.details);
        setIsLoading(false);
      });
  }, []);

  // Listen to message event
  // Unsubscribe when unmounting
  useEffect(() => {
    socket.on('receive-message', (data: Message) => {
      const chat = chats.find(chat => chat.id === data.chatId)!;
      chat.messages.push(data);
      chat.latestMessage = data;
      chats.splice(chats.indexOf(chat), 1);
      setChats([
        {
          ...chat,
          participants: chat.participants.map(participant => ({
            ...participant,
            read: currentChatId === chat.id ? true : false,
          })),
        },
        ...chats,
      ]);
    });

    socket.on('chat-created', (data: Chat) => {
      setChats([
        {
          ...data,
          offset: MESSAGES_LIMIT,
          hasMore: false,
        },
        ...chats,
      ]);
    });

    socket.on('chat-read', (event: Chat) => {
      const newChats = [...chats];
      const index = newChats.findIndex(chat => chat.id === event.id)!;
      const oldChat = newChats[index];
      newChats[index] = {
        ...event,
        messages: oldChat.messages,
        latestMessage: oldChat.latestMessage,
        offset: oldChat.offset,
        hasMore: oldChat.hasMore,
      };
      setChats(newChats);
    });

    return () => {
      socket.off('receive-message');
      socket.off('chat-created');
      socket.off('chat-read');
    };
  }, [chats, currentChatId]);

  const updateNewChat = (chat: ExtendedChat) => {
    chats.splice(
      chats.findIndex(old => old.id === chat.id),
      1,
    );
    setChats([chat, ...chats]);
  };

  if (error) {
    return <ErrorComponent message={error} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ flexGrow: 1 }} variant="h5">
              Contacts
            </Typography>
            <AddContactModal
              openModal={openModal}
              setOpenModal={setOpenModal}
              excludeAccountIds={chats.map(
                chat =>
                  chat.participants.find(
                    participant => participant.id !== account!.id,
                  )!.id,
              )}
            />
            <Button
              startIcon={<Add />}
              onClick={() => {
                setOpenModal(true);
              }}
            >
              Add contact
            </Button>
          </Box>

          <TextField
            id="outlined-basic"
            label="Search chats"
            placeholder="Search user name, email..."
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <List>
          {chats.map(chat => {
            const otherParticipant = chat.participants.find(
              participant => participant.id !== account!.id,
            )!;
            const myParticipant = chat.participants.find(
              participant => participant.id === account!.id,
            )!;
            return (
              <ListItem
                disableGutters
                key={chat.id}
                alignItems="flex-start"
                secondaryAction={
                  <Typography color={'gray'} variant="body2">
                    {chat.latestMessage
                      ? dayjs(chat.latestMessage.createdAt).format('DD MMM')
                      : ''}
                  </Typography>
                }
              >
                <ListItemButton
                  onClick={() => {
                    socket.emit('read-chat', chat.id);
                    return setCurrentChatId(chat.id);
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={getImageUrlOrDefault(otherParticipant.avatarId)}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={getProfileDisplayNameOrDefault(
                      otherParticipant,
                      otherParticipant.email,
                    )}
                    secondary={
                      chat.latestMessage
                        ? chat.latestMessage.message
                        : 'New chat added'
                    }
                    primaryTypographyProps={{
                      fontWeight: myParticipant.read ? 'normal' : 'bold',
                    }}
                    secondaryTypographyProps={{
                      fontWeight: myParticipant.read ? 'normal' : 'bold',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Grid>
      <Grid item xs={8}>
        {currentChatId ? (
          <ChatSection
            chat={chats.find(chat => chat.id === currentChatId)!}
            socket={socket}
            scrollToRef={scrollToRef}
            updateNewChat={updateNewChat}
          />
        ) : (
          <Typography
            variant="h6"
            fontWeight={'bold'}
            sx={{ width: '100%', my: 4 }}
            textAlign="center"
          >
            Select a chat to start messaging
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};
