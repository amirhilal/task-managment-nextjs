import { io } from 'socket.io-client';

let socket;

export const initializeSocket = () => {
  socket = io();
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized. Call initializeSocket first.');
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};