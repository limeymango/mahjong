
const CAKE = 'Cake';
const STICK = 'Stick';
const NUMBER = 'Number';
const WIND = 'Wind';
const DRAGON = 'Dragon';

const EAST = 'East';
const SOUTH = 'South';
const WEST = 'West';
const NORTH = 'North';

const RED = 'Red';
const GREEN = 'Green';
const WHITE = 'White';


class Tile {
  constructor(type, value) {
    this.type = type;
    // Depending on the tile type, value can be a number, a cardinal direction, or a color!
    this.value = value;
  }
}

class TileSet {
  constructor() {
    this.tiles = [];

    const TYPES = [WIND, DRAGON, CAKE, STICK, NUMBER];
    const DIRECTIONS = [EAST, SOUTH, WEST, NORTH];
    const COLORS = [RED, GREEN, WHITE];

    let uniqueTiles = [];
    for (let i = 0; i < TYPES.length; i++) {
      const type = TYPES[i];
      if (type === WIND) {
        for (let j = 0; j < DIRECTIONS.length; j++) {
          uniqueTiles.push(new Tile(WIND, DIRECTIONS[j]));
        }        
      } else if (type === DRAGON) {
        for (let j = 0; j < COLORS.length; j++) {
          uniqueTiles.push(new Tile(DRAGON, COLORS[j]));
        }
      } else {
        for (let j = 1; j <= 9; j++) {
          uniqueTiles.push(new Tile(type, j));
        }
      }
    }

    // There are 4 of each tile, so duplicate the unique set.
    this.tiles = uniqueTiles.concat(uniqueTiles);
    this.tiles = this.tiles.concat(this.tiles);
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

class Player {
  constructor(name) {
    this.name = name;
    this.hand = null;
  }

  draw(tiles) {
    this.hand.push(tiles.pop());
  }

  discard(tile) {
    this.hand.splice(this.hand.indexOf(tile), 1);
    return tile;
  }
}

class Game {
  constructor(name1, name2, name3, name4) {

    this.players = [
      new Player(name1), new Player(name2),
      new Player(name3), new Player(name4),
    ];
    this.activePlayerNumber = 1; // out of 4

    const tileSet = new TileSet();
    tileSet.shuffle();

    this.players[0].hand = tileSet.tiles.slice(0, 13);
    this.players[1].hand = tileSet.tiles.slice(13, 26);
    this.players[2].hand = tileSet.tiles.slice(26, 39);
    this.players[3].hand = tileSet.tiles.slice(39, 52);

    this.remainingTiles = tileSet.tiles.slice(52);
    this.discardedTiles = [];

    this.newTurn();
  }

  newTurn() {
    const player = this.players[this.activePlayerNumber - 1];
    const turnTeller = document.getElementById('active-player-name');
    turnTeller.textContent = player.name;
    player.draw(this.remainingTiles);
  }
}

class PlayerView {
  constructor(player) {
    this.player = player;
    this.element = document.getElementById('player-view');

    this.updateHand(player.hand);
  }

  updateHand(hand) {
    const tilesList = document.createElement('ul');

    hand.forEach((tile) => {
      const listItem = document.createElement('li');
      listItem.textContent = tile.value + ' ' + tile.type;
      tilesList.appendChild(listItem);
    })
    this.element.appendChild(tilesList);
  }

}

const game = new Game('a', 'b', 'c', 'd');
const playerView = new PlayerView(game.players[0]);