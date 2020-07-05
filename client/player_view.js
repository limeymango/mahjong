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

module.exports = PlayerView;