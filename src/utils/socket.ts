import { io } from 'socket.io-client';

export const BASE_SOCKET_URL = 'ws://localhost:3000';

export const socket = io(BASE_SOCKET_URL, {
  transports: ['websocket'],
  autoConnect: false,
  auth: cb => {
    console.log('Authenticating socket...');
    cb({ token: localStorage.getItem('accessToken') });
  },
});

socket.on('connect', () => {
  console.log('Socket connected');
});

socket.on('disconnect', () => {
  console.log('Socket disconnected');
});

socket.on('error', (error: any) => {
  console.warn('Socket error', error);
});
