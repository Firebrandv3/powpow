'use strict';

var Character = require('./character');

function Player(game, x, y) {
    this.game = game;

    this.sprite = this.createSprite();

    this.controlKeys = this.controlsMapping();
}

Player.prototype.createSprite = function() {
    var sprite = new Character(
        this.game, 
        this.game.world.randomX, 
        this.game.world.height
    );

    sprite.anchor.set(0.5);
    this.game.physics.enable(sprite);
    sprite.body.collideWorldBounds = true;

    // add sprite to world
    this.game.add.existing(sprite);

    return sprite;
};

Player.prototype.update = function() {
    if (!this.sprite) return;

    // movement
    if (this.controlKeys.left.isDown) {
        this.sprite.callAction('moveLeft');
    } else if (this.controlKeys.right.isDown) {
        this.sprite.callAction('moveRight');
    } 

    // set looking direction
    if (
        !this.sprite.body.onFloor() || 
        !this.controlKeys.right.isDown && 
        !this.controlKeys.left.isDown
    ) {
        if (this.sprite.isLookingLeft()) {
            this.sprite.lookLeft();
        } else {
            this.sprite.lookRight();
        }
    }

    // jumping
    if (this.controlKeys.jump.isDown) {
        this.sprite.callAction('jump');
    }
};

Player.prototype.controlsMapping = function() {
    var that = this;

    return {
        left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),

        right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),

        jump: this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    };
};

module.exports = Player;
