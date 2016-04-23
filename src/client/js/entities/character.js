'use strict';

var Weapon = require('./weapon');

var MOVEMENT_SPEED = 4;
var JUMP_SPEED = -800;

// view representation of the character without any businesscode
// Controlled by another entity
function Character(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'character', 0);

    this.isAimingLeft = false;

    this.movingAnimation = null;

    this.weapon = null;

    this.addAnimations();
}

Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;

Character.prototype.addAnimations = function() {
    this.animations.add('rightForward', [0, 1, 2], 10);
    this.animations.add('rightBackward', [1, 2, 0], 10);
    this.animations.add('leftForward', [3, 4, 5], 10);
    this.animations.add('leftBackward', [4, 5, 3], 10);
};

Character.prototype.createWeapon = function() {
    // var weapon = new Weapon(this.game, this.width / 2, this.height / 2);

    // weapon.anchor.setTo(-0.5, 0.5);
    
    var weapon = new Weapon(this.game, this.width / 2, 0);

    weapon.anchor.setTo(0.5, 0.5);

    return weapon;
};

Character.prototype.actionsMapping = {
    moveLeft: function() {
        this.x -= MOVEMENT_SPEED;
            
        if (!this.body.onFloor()) return;

        if (!this.isAimingLeft) {
            this.movingAnimation = this.animations.play('rightBackward');
        } else {
            this.movingAnimation = this.animations.play('leftForward');
        }
    },

    moveRight: function() {
        this.x += MOVEMENT_SPEED;

        if (!this.body.onFloor()) return;
        
        if (this.isAimingLeft) {
            this.movingAnimation = this.animations.play('leftBackward');
        } else {
            this.movingAnimation = this.animations.play('rightForward');
        }
    },

    jump: function() {
        if (!this.body.onFloor()) return;

        this.body.velocity.y = JUMP_SPEED;
    },

    shoot: function(angle) {
        this.weapon.shoot(angle);
    }
};

Character.prototype.callAction = function(action) {
    var args = Array.prototype.splice.call(arguments, 0, 1);

    if (this.actionsMapping[action]) {
        this.actionsMapping[action].apply(this, args);
    }
};

Character.prototype.noMovingAnim = function() {
    return !this.movingAnimation || this.movingAnimation && this.movingAnimation.isFinished;
};

Character.prototype.lookLeft = function() {
    if (!this.body.onFloor()) {
        this.frame = 5;
    } else if (this.noMovingAnim()) {
        this.frame = 3;
    }
};

Character.prototype.lookRight = function() {
    if (!this.body.onFloor()) {
        this.frame = 2;
    } else if (this.noMovingAnim()) {
        this.frame = 0;
    }
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
};

module.exports = Character;
