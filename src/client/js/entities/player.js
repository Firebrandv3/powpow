/**
* Studiengang: MultimediaTechnology / FHS
* Zweck: Web (Basisqualifikationen)
* Autor: Erfan Ebrahimnia
*/

'use strict';

var _ = require('underscore');
var Character = require('./character');

function Player(game, data) {
    this.game = game;

    this.nick = _.unescape(data.nick);

    this.x = data.x;

    this.y = data.y;

    this.aimDirection = null;

    this.health = data.health;

    this.isFlying = false;

    this.isAlive = true;

    this.ammo = data.ammo;

    this.character = null;

    this.controlKeys = this.controlsMapping();

    this.bindControlEvents();
}

Player.prototype.toJSON = function() {
    return {
        id: this.id,
        nick: this.nick,
        x: this.character.x,
        y: this.character.y,
        aimDirection: this.aimDirection,
        isAimingLeft: this.character.isAimingLeft,
        isFlying: this.isFlying,
        ammo: this.ammo
    };
};

Player.prototype.createCharacter = function() {
    var character = new Character(
        this.game,
        this.x,
        this.y,
        true,
        this.id,
        this.nick
    );

    character.create();
    character.onHit = this.onHit.bind(this);
    character.onPickup = this.onPickup.bind(this);

    // add character sprite to world
    this.game.add.existing(character);
    this.game.camera.follow(character);

    this.character = character;

    return character;
};

Player.prototype.bindControlEvents = function() {
    this.game.canvas.addEventListener('click', this.mouseClickHandler.bind(this), false);
};

Player.prototype.mouseClickHandler = function(event) {
    if (this.isAlive && event.button === Phaser.Mouse.LEFT_BUTTON && this.ammo > 0) {
        this.ammo--;
        App.UI.Game.decreaseAmmo();
        this.character.callAction('shoot', this.aimDirection);
        App.socket.emit('client.action.shoot', { aimDirection: this.aimDirection });
    } else if (this.ammo <= 0) {
        this.game.sound.play('no-ammo');
    }
};

Player.prototype.onHit = function(shooter) {
    App.UI.Game.playHitEffect();
    App.UI.Game.decreaseHealth();
    App.socket.emit('client.action.hit', { shooterId: shooter.id });
};

Player.prototype.pickupHandlers = {
    // considering to decouple ui code from game logic...
    'health': function() {
        if (App.UI.Game.increaseHealth()) {
            this.health++;
            return true;
        }
        return false;
    },

    'ammo': function() {
        if (App.UI.Game.increaseAmmo()) {
            this.ammo++
            return true;
        }
        return false;
    }
};

Player.prototype.onPickup = function(pickup) {
    if (!!this.pickupHandlers[pickup.type]) {
        App.socket.emit('client.action.pickup', { id: pickup.id, type: pickup.type });
        // call the right handler e.g. increaseHealth
        return this.pickupHandlers[pickup.type].call(this);
    }
    return false;
};

Player.prototype.die = function() {
    this.isAlive = false;

    this.character.die();
};

Player.prototype.revive = function(data) {
    this.game.camera.unfollow(this.character);

    this.nick = _.unescape(data.nick);

    this.x = data.x;

    this.y = data.y;

    this.health = data.health;

    this.ammo = data.ammo;

    this.createCharacter();

    this.isAlive = true;
};

Player.prototype.update = function() {
    if (!this.character || !this.isAlive) return;

    // send at half update speed
    if (this.hasLockedSocket) {
        this.hasLockedSocket = false;
        App.socket.emit('client.update.data', this.toJSON());
    } else {
        this.hasLockedSocket = true;
    }

    // aim direction in degree
    this.aimDirection = this.game.physics.arcade.angleToPointer(this.character);

    // set aiming side direction
    this.character.isAimingLeft = this.isAimingLeft();

    // flying
    if (this.game.input.activePointer.rightButton.isDown) {
        this.character.callAction('startJetPack');
        this.isFlying = true;
    } else {
        this.character.callAction('stopJetPack');
        this.isFlying = false;
    }

    // movement
    if (this.controlKeys.left.isDown) {
        this.character.callAction('moveLeft');
    } else if (this.controlKeys.right.isDown) {
        this.character.callAction('moveRight');
    } else {
        this.character.callAction('stopMove');
    }

    // aiming direction
    this.character.setAimDirection(this.aimDirection);
};

Player.prototype.controlsMapping = function() {
    return {
        left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),

        right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),

        fly: this.game.input.activePointer.rightButton
    };
};

Player.prototype.isAimingLeft = function() {
    return this.game.input.activePointer.x < this.character.x - this.game.camera.x;
};

module.exports = Player;
