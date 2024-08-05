import { PrismaClient } from '@prisma/client';
import { Server } from 'socket.io';

const prisma = new PrismaClient();

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {

    socket.on('joinRoom', ({ room }) => {
      socket.join(room);
    });

    socket.on('sendMessage', async ({ senderId, receiverId, message, room }) => {
      if (!senderId || !receiverId || !message) {
        return;
      }

      const newMessage = await prisma.message.create({
        data: {
          senderId,
          receiverId,
          content: message,
        },
      });

      io.to(room).emit('receiveMessage', newMessage);
    });

    socket.on('disconnect', () => {
    });
  });
}
