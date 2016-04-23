'use strict';

function Preload() {}

Preload.prototype.preload = function() {
    this.loadAssets();
    this.load.onLoadComplete.addOnce(this.onLoadCompleteHandler, this);
};

Preload.prototype.loadAssets = function() {
    // images
    this.load.image('grid', 'game-assets/grid.jpg');
    this.load.spritesheet('character', 'game-assets/sprites/character.png', 100, 140, 6);
    this.load.image('weapon', 'game-assets/sprites/weapon.png', 96, 52);
    this.load.image('projectile', 'game-assets/sprites/projectile.gif', 74, 24);
    this.load.image('map-tileset', 'game-assets/tilemaps/tiles/map-tileset.png');

    // tilemap
    this.load.tilemap('map', 'game-assets/tilemaps/map.json', null, Phaser.Tilemap.TILED_JSON);
};

Preload.prototype.onLoadCompleteHandler = function() {
    this.game.state.start('game');
};

module.exports = Preload;
