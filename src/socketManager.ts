// socketManager.ts

import { Server as SocketIoServer } from 'socket.io';

let io: SocketIoServer;

export const initializeSocketIo = (httpServer: any) => {
  io = new SocketIoServer(httpServer);

  io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected', socket.id);
    });

    // Additional socket event handlers...
  });
};

export const getSocketIo = () => {
  if (!io) throw new Error("Socket.io has not been initialized!");
  return io;
};
