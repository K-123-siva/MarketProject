const Message = require('../models/Message');

const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join', (userId) => {
      socket.join(`user_${userId}`);
    });

    socket.on('sendMessage', async ({ senderId, receiverId, message, listingId }) => {
      try {
        const msg = await Message.create({ senderId, receiverId, message, listingId });
        io.to(`user_${receiverId}`).emit('newMessage', msg);
        io.to(`user_${senderId}`).emit('newMessage', msg);
      } catch (err) {
        console.error(err);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = setupSocket;
