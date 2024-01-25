import { createContext, useContext, useEffect } from 'react';
import { Socket, io } from 'socket.io-client';
import { BASE_SOCKET_URL } from 'utils/socket';
import { useAuth } from './AuthContext';

export const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { accessToken } = useAuth();

  const socket = io(BASE_SOCKET_URL, {
    transports: ['websocket'],
    autoConnect: false,
    auth: {
      token: accessToken,
    },
  });

  // Disconnect socket when unmounting
  useEffect(() => {
    socket.on('error', err => {
      console.error(err);
    });
    return () => {
      console.log('disconnecting socket');
      socket.disconnect();
    };
  }, [accessToken]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
