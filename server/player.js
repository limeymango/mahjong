class Player {
  constructor(name, socket) {
    this.name = name;
    this.socket = socket;
    this.hand = [];
  }

  draw(tiles) {
    this.hand.push(tiles.pop());
  }

  discard(tile) {
    const tileIndex = this.hand.findIndex((handTile) => handTile.id === tile.id);
    if (tileIndex === -1) {
      throw new Error('Tile Not Available');
    }
    this.hand.splice(tileIndex, 1);
    return this.hand;
  }
}

module.exports = Player;