'use strict';

var Weapon = require('./weapon');
var JetPack = require('./jetpack');
var ProjectilesManager = require('./projectiles');

var MOVEMENT_VELOCITY = 100;
var FLY_VELOCITY = -100;
var RECOIL_POWER = 400;
var MOVEMENT_DRAG = 500;
var RECOIL_EFFECT_DURATION = 800;
var JET_PACK_OFFSET_X = 20;
var JET_PACK_OFFSET_Y = 25;

// view representation of the character without any businesscode
// Controlled by another entity
function Character(game, x, y, id, nick) {
    Phaser.Sprite.call(this, game, x, y, 'character', 0);

    this.id = id;

    this.nick = nick;

    this.isAimingLeft = false;

    this.movingAnimation = null;

    this.inRecoilAnimation = false;

    this.weapon = null;

    this.jetPack = null;

    this.label = null;

    this.addAnimations();
}

Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;

Character.prototype.setPosition = function(point) {
    this.x = point.x;
    this.y = point.y;
};

Character.prototype.addAnimations = function() {
    this.animations.add('rightForward', [0, 1, 2], 10);
    this.animations.add('rightBackward', [1, 2, 0], 10);
    this.animations.add('leftForward', [3, 4, 5], 10);
    this.animations.add('leftBackward', [4, 5, 3], 10);
};

/**
 * Custom create function
 */
Character.prototype.create = function() {
    this.game.physics.enable(this);
    this.anchor.setTo(0.5);

    this.body.collideWorldBounds = true;
    this.body.drag.x = MOVEMENT_DRAG;

    this.weapon = this.createWeapon();
    this.jetPack = this.createJetPack();
    this.label = this.createLabel();

    this.addChild(this.weapon);
    this.addChild(this.jetPack);
    this.addChild(this.label);
};

Character.prototype.createWeapon = function() {
    var weapon = new Weapon(this.game, 0, 0);

    weapon.anchor.setTo(-0.7, 0.5);
    weapon.useProjectiles(ProjectilesManager);

    return weapon;
};

Character.prototype.createJetPack = function() {
    var jetPack = new JetPack(this.game, 0, 0);

    jetPack.anchor.setTo(0.5);

    return jetPack;
};

Character.prototype.createLabel = function() {
    var label;
    var style = { 
        font: 'bold 16px Arial', 
        fill: '#111111', 
        align: 'center'
    };

    label = this.game.add.text(0, -this.height / 2, this.nick, style);
    label.anchor.set(0.5);

    return label;
};

/**
 * called when a projectile hits the character
 * should be overwritten by the parent class
 */
Character.prototype.onHit = function() {};

/**
 * called when an item was picked up
 * should be overwritten by the parent class
 */
Character.prototype.onPickup = function() {};

Character.prototype.die = function() {
    var deathSprite = this.game.add.sprite(this.x, this.y, 'death');

    deathSprite.anchor.setTo(0.5);
    deathSprite.scale.setTo(0.75);
        
    this.game.add.tween(deathSprite).to({
        alpha: 0,
        y: this.y - 100
    }, 1000, null, true, 100)
    .onComplete.add(function() {
        deathSprite.destroy()
    });
    
    this.game.add.tween(this).to({
        alpha: 0
    }, 500, null, true)
    .onComplete.add(function() {
        this.destroy();
    }.bind(this));
};

Character.prototype.actionsMapping = {
    moveLeft: function() {
        if (this.inRecoilAnimation) return;

        this.body.velocity.x = -MOVEMENT_VELOCITY;

        if (!this.body.onFloor()) return;

        if (!this.isAimingLeft) {
            this.movingAnimation = this.animations.play('rightBackward');
        } else {
            this.movingAnimation = this.animations.play('leftForward');
        }
    },

    moveRight: function() {
        if (this.inRecoilAnimation) return;

        this.body.velocity.x = MOVEMENT_VELOCITY;

        if (!this.body.onFloor()) return;
        
        if (this.isAimingLeft) {
            this.movingAnimation = this.animations.play('leftBackward');
        } else {
            this.movingAnimation = this.animations.play('rightForward');
        }
    },

    stopMove: function() {
        if (this.body.onFloor()) {
            this.body.velocity.x = 0;
        }
    },

    startJetPack: function() {
        this.body.velocity.y = FLY_VELOCITY;
        this.jetPack.start();
    },

    stopJetPack: function() {
        this.jetPack.stop();
    },

    shoot: function(angle) {
        this.weapon.shoot(angle, { id: this.id });
        
        if (!this.body.onFloor()) {
            this.recoilJumpCount++;
            this.shotRecoil(angle);
        }
    }
};

Character.prototype.callAction = function(action) {
    var args = Array.prototype.splice.call(arguments, 1, 1);

    if (this.actionsMapping[action]) {
        this.actionsMapping[action].apply(this, args);
    }
};

Character.prototype.shotRecoil = function(angle) {
    this.body.velocity.x = - RECOIL_POWER * Math.cos(angle);
    this.body.velocity.y = - RECOIL_POWER * Math.sin(angle);

    this.inRecoilAnimation = true;

    this.game.time.events.add(RECOIL_EFFECT_DURATION, function() {
        this.inRecoilAnimation = false;
    }.bind(this));
};

Character.prototype.noMovingAnim = function() {
    return !this.movingAnimation || this.movingAnimation && this.movingAnimation.isFinished;
};

Character.prototype.lookLeft = function() {
    if (!this.body.onFloor()) {
        this.frame = 5;
        this.jetPack.y = 0;
    } else if (this.noMovingAnim()) {
        this.frame = 3;
    }

    this.jetPack.x = (this.width + JET_PACK_OFFSET_X) / 2;
};

Character.prototype.lookRight = function() {
    if (!this.body.onFloor()) {
        this.frame = 2;
        this.jetPack.y = 0;
    } else if (this.noMovingAnim()) {
        this.frame = 0;
    }

    this.jetPack.x = -1 * (this.width + JET_PACK_OFFSET_X) / 2;
};

Character.prototype.setAimDirection = function(angle) {
    this.weapon.rotation = angle;
};

Character.prototype.update = function() {
    if (this.isAimingLeft) {
        this.lookLeft()
    } else {
        this.lookRight();
    }

    if (this.body.onFloor()) {
        this.jetPack.y = JET_PACK_OFFSET_Y;
    } else {
        this.jetPack.y = 10;
    }
};

module.exports = Character;
