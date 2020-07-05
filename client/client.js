const PlayerView = require('./player_view');

const writeEvent = (message) => {
  const parent = document.querySelector('#player-view');

  const newChild = document.createElement('div');
  newChild.textContent = message;

  parent.appendChild(newChild);
};

let playerView = null;
const onDiscard = () => {
  if (!playerView.selectedTile) {
    writeEvent('No tile selected, please select a tile.');
    return;
  }
  socket.emit('discard', playerView.selectedTile);
  playerView.selectedTile = null;
};

const socket = io();
socket.on('message', writeEvent);

socket.on('gamestart', (hand) => {
  console.log('new game started');
  playerView = new PlayerView(document.getElementById('player-view'), hand);
});

socket.on('newturn', (name) => {
  const activePlayer = document.getElementById('active-player-name');
  activePlayer.textContent = name;
});

socket.on('updatehand', (hand) => {
  playerView.updateHand(hand);
});

document.querySelector('#discard')
  .addEventListener('click', onDiscard);
