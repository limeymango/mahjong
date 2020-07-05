const assert = require('assert').strict;
const { v4: uuid } = require('uuid');

const Player = require('./player.js');

// Tile Types
const CAKE = 'Cake';
const STICK = 'Stick';
const NUMBER = 'Number';
const WIND = 'Wind';
const DRAGON = 'Dragon';

// Wind Directions
const EAST = 'East';
const SOUTH = 'South';
const WEST = 'West';
const NORTH = 'North';

// "Dragon" Colors
const RED = 'Red';
const GREEN = 'Green';
const WHITE = 'White';


class Tile {
  constructor(type, value) {
    this.type = type;
    // Depending on the tile type, value can be a number, a cardinal direction, or a color!
    this.value = value;

    this.id = 'tile-' + uuid();
  }
}

class TileSet {
  constructor() {
    this.tiles = [];

    const TYPES = [WIND, DRAGON, CAKE, STICK, NUMBER];
    const DIRECTIONS = [EAST, SOUTH, WEST, NORTH];
    const COLORS = [RED, GREEN, WHITE];

    for (let k = 0; k < 4; k++) {
      for (let i = 0; i < TYPES.length; i++) {
        const type = TYPES[i];
        if (type === WIND) {
          for (let j = 0; j < DIRECTIONS.length; j++) {
            this.tiles.push(new Tile(WIND, DIRECTIONS[j]));
          }        
        } else if (type === DRAGON) {
          for (let j = 0; j < COLORS.length; j++) {
            this.tiles.push(new Tile(DRAGON, COLORS[j]));
          }
        } else {
          for (let j = 1; j <= 9; j++) {
            this.tiles.push(new Tile(type, j));
          }
        }
      }
    }
    assert(this.tiles.length === 136);
  }

  shuffle() {
    // from https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
    for (let i = this.tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = this.tiles[i];
      this.tiles[i] = this.tiles[j];
      this.tiles[j] = temp;
    }
  }
}

class MahjongGame {
  constructor(p1, p2, p3) {

    this.players_ = [
      new Player('Player1', p1), new Player('Player2', p2),
      new Player('Player3', p3), // new Player(name4),
    ];
    this.sendToAllPlayers('message', 'Game Start! Let\'s Play Mahjong!');

    this.activePlayerIndex = 0;

    const tileSet = new TileSet();
    tileSet.shuffle();

    this.players_[0].hand = tileSet.tiles.slice(0, 13);
    this.players_[1].hand = tileSet.tiles.slice(13, 26);
    this.players_[2].hand = tileSet.tiles.slice(26, 39);
    //this.players[3].hand = tileSet.tiles.slice(39, 52);

    this.remainingTiles = tileSet.tiles.slice(39); //(52);
    this.discardedTiles = [];

    this.players_.forEach((player, index) => {
      player.socket.on('discard', (tile) => {
        if (this.activePlayerIndex !== index) {
          this.sendToPlayer(index, 'message', 'Wait your turn!');
          return;
        }
        
        try {
          player.discard(tile);
        } catch (e) {
          console.error('DiscardError: ' + player.name + '\'s hand does not have ' +
            'a ' + tile.value + ' ' + tile.type);
          console.log(player.hand);
          return;
        }
        this.discardedTiles.push(tile);
        this.sendToPlayer(index, 'updatehand', player.hand);
        this.sendToAllPlayers('message',
          `${player.name} discarded a ${tile.value} ${tile.type} tile`);
      });

      this.sendToPlayer(index, 'gamestart', player.hand);
    });
    this.sendToAllPlayers(
      'newturn', this.players_[this.activePlayerIndex].name);
  }

  sendToAllPlayers(event, value) {
    this.players_.forEach((player) => {
      player.socket.emit(event, value);
    });
  }

  sendToPlayer(playerIndex, event, value) {
    this.players_[playerIndex].socket.emit(event, value);
  }

  newTurn() {
    const player = this.players_[this.activePlayerNumber - 1];
    const turnTeller = document.getElementById('active-player-name');
    turnTeller.textContent = player.name;
    player.draw(this.remainingTiles);
  }
}

module.exports = MahjongGame;