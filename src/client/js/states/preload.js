'use strict';

function Preload() {}

Preload.prototype.preload = function() {
    this.loadAssets();
    this.load.onLoadComplete.addOnce(this.onLoadCompleteHandler, this);
};

Preload.prototype.loadAssets = function() {
    this.load.image('grid', 'game-assets/grid.jpg');
    this.load.spritesheet('character', 'game-assets/sprites/character.png', 64, 64, 20);
};

Preload.prototype.onLoadCompleteHandler = function() {
    this.game.state.start('game');
};

module.exports = Preload;
