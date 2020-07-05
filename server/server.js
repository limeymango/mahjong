const http = require('http');
const express = require('express');
const socketIo = require('socket.io');

const MahjongGame = require('./mahjong');

// Set up to serve static files
const clientPath = `${__dirname}/../client`;
console.log(`serving static files from ${clientPath}`);

const app = express();
app.use(express.static(clientPath));

const server = http.createServer(app);
const io = socketIo(server);

let lobby = [];

io.on('connection', (socket) => {
  lobby.push(socket);
  if (lobby.length === 3) {
    // start a game
    new MahjongGame(...lobby);
    lobby = [];
  } else {
    lobby.forEach(socket => {
      socket.emit('message',
        `In the lobby: ${lobby.length} ` +
        `${lobby.length === 1 ? 'person' : 'people'}`);
    });
  }
});

server.on('error', (e) => {
  console.error('server error: ', e);
});

server.listen(8080, () => {
  console.log('server started on 8080');
});