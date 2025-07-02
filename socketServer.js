const { Server } = require('socket.io');

const io = new Server(3001, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);

  socket.on('mensaje', (data) => {
    console.log('Mensaje recibido:', data);
    io.emit('mensaje', data); // Reenviar el mensaje a todos los clientes
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

console.log('Servidor de WebSocket escuchando en el puerto 3001'); 