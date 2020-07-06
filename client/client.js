class PlayerView {
  constructor(element, hand) {
    this.element = element;
    this.tilesList = null;
    this.selectedTile = null;
 
    this.updateHand(hand);
  }

  // Updates the tiles shown as the player's hand.
  updateHand(hand) {
    if (this.tilesList) {
      this.tilesList.remove();
    }

    this.tilesList = document.createElement('ul');

    hand.forEach((tile) => {
      const tileElement = document.createElement('div');
      tileElement.classList.add('tile');
      tileElement.id = tile.id;
      tileElement.textContent = `${tile.value} ${tile.type}`;

      tileElement.addEventListener('click', () => {
        this.setSelectedTile(tile);
      });

      const listItem = document.createElement('li');
      listItem.appendChild(tileElement);
      this.tilesList.appendChild(listItem);
    })
    this.element.querySelector('#player-view--hand')
      .appendChild(this.tilesList);
  }

  setSelectedTile(tile) {
    let selectedTileElement = null;
    if (this.selectedTile) {
      selectedTileElement = document.getElementById(this.selectedTile.id);
      selectedTileElement.classList.remove('tile--selected');
    }

    this.selectedTile = tile;
    selectedTileElement = document.getElementById(this.selectedTile.id);
    selectedTileElement.classList.add('tile--selected');
  }
}

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

socket.on('name', (name) => {
  const playerName = document.getElementById('name');
  playerName.textContent = name;
});

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
