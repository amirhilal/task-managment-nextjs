const socketIo = require('socket.io');

function initializeSocket(server) {
  const io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('taskMoved', (data) => {
      socket.broadcast.emit('taskMoved', data);
    });

    socket.on('newTask', (task) => {
      socket.broadcast.emit('newTask', task);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return io;
}

module.exports = initializeSocket;