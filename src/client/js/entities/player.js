'use strict';

var Character = require('./character');

function Player(game) {
    this.game = game;

    this.name = null;

    this.character = this.createCharacter();

    this.controlKeys = this.controlsMapping();
}

Player.prototype.createCharacter = function() {
    var character = new Character(
        this.game, 
        this.game.world.randomX, 
        this.game.world.height / 2
    );

    character.anchor.setTo(0.5);

    this.game.physics.enable(character);
    character.body.collideWorldBounds = true;

    character.weapon = character.createWeapon();

    // add character sprite to world
    this.game.add.existing(character);

    character.addChild(character.weapon);

    return character;
};

Player.prototype.update = function() {
    var aimDirection;

    if (!this.character) return;

    // aim direction in degree
    aimDirection = this.game.physics.arcade.angleToPointer(this.character);

    // set aiming side direction
    this.character.isAimingLeft = this.isAimingLeft();

    // movement
    if (this.controlKeys.left.isDown) {
        this.character.callAction('moveLeft');
    } else if (this.controlKeys.right.isDown) {
        this.character.callAction('moveRight');
    } else {
        this.character.callAction('stopMove');
    }

    // aiming direction
    this.character.setAimDirection(aimDirection);

    // shooting
    if (this.game.input.activePointer.isDown) {
        this.character.callAction('shoot', aimDirection);
    }

    // jumping
    if (this.controlKeys.jump.isDown) {
        this.character.callAction('jump');
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

Player.prototype.isAimingLeft = function() {
    return this.game.input.activePointer.x < this.character.x - this.game.camera.x;
};

module.exports = Player;
