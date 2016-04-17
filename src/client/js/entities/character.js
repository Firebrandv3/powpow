'use strict';

// view representation of the character without any businesscode
// Controlled by another entity
function Character(game) {
    this.game = game;

    this.pos = {
        x: this.game.world.randomX,
        y: this.game.world.height
    };

    this.sprite = this.createSprite();

    this.addAnimations();
}

Character.prototype.createSprite = function() {
    var sprite = this.game.add.sprite(this.pos.x, this.pos.y, 'character');

    sprite.anchor.set(0.5);
    this.game.physics.enable(sprite);

    sprite.body.collideWorldBounds = true;

    return sprite;
};

Character.prototype.addAnimations = function() {
    this.sprite.animations.add('idle', [1], 1, false);
    this.sprite.animations.add('right', [0, 1, 2], 10);
    this.sprite.animations.add('left', [3, 4, 5], 10);
};

module.exports = Character;
