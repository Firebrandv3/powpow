/**
* Studiengang: MultimediaTechnology / FHS
* Zweck: Web (Basisqualifikationen)
* Autor: Erfan Ebrahimnia
*/

'use strict';

var _ = require('underscore');
var Character = require('./character');

var FIX_POSITION_INTERVAL = 5000;

function Enemy(game, data) {
    this.game = game;

    this.id = null;

    this.nick = null;

    this.x = 0;

    this.y = 0;

    this.movingDirection = 0;

    this.health = 0;

    this.isAlive = true;

    this.isFlying = false;

    this.aimDirection = null;

    this.isAimingLeft = null;

    this.character = null;

    this.nextFixPositionTime = 0;

    this.parse(data);
}

Enemy.prototype.parse = function(data) {
    this.id = data.id;

    this.nick = _.unescape(data.nick);

    this.x = data.x;

    this.y = data.y;

    this.isAlive = data.isAlive;

    this.aimDirection = data.aimDirection,

    this.isAimingLeft = data.isAimingLeft;

    this.isFlying = data.isFlying;
};

Enemy.prototype.createCharacter = function() {
    var character = new Character(
        this.game,
        this.x,
        this.y,
        this.id,
        this.nick
    );

    character.create();

    // add character sprite to world
    this.game.add.existing(character);

    this.character = character;

    return character;
};

Enemy.prototype.updateData = function(data) {
    if (this.x < data.x) {
        // moving right
        this.movingDirection = 1;
    } else if (this.x > data.x) {
        // moving left
        this.movingDirection = -1;
    } else {
        // standing still
        this.movingDirection = 0;
    }

    this.isFlying = data.isFlying;

    this.x = data.x;

    this.y = data.y;

    this.isAlive = data.isAlive;

    this.aimDirection = data.aimDirection,

    this.isAimingLeft = data.isAimingLeft;
};

Enemy.prototype.fixPosition = function() {
    this.game.add.tween(this.character)
        .to({ 
            x: this.x,
            y: this.y 
        }, 50, 'Linear', true);
};

Enemy.prototype.shootHandler = function() {
    this.character.callAction('shoot', this.aimDirection);
};

Enemy.prototype.die = function() {
    this.character.die();
};

Enemy.prototype.update = function() {
    if (!this.character || !this.isAlive) return;

    // set aiming side direction
    this.character.isAimingLeft = this.isAimingLeft;

    if (this.isFlying) {
        this.character.callAction('startJetPack');
    } else {
        this.character.callAction('stopJetPack');
    }

    // movement
    if (this.movingDirection < 0) {
        this.character.callAction('moveLeft');
    } else if (this.movingDirection > 0) {
        this.character.callAction('moveRight');
    } else {
        this.character.callAction('stopMove');
    }

    this.character.setAimDirection(this.aimDirection);

    // smoothly update to server position
    if (this.game.time.time >= this.nextFixPositionTime) {
        this.fixPosition();
        this.nextFixPositionTime = this.game.time.time + FIX_POSITION_INTERVAL;
    }
};

module.exports = Enemy;
