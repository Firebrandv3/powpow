'use strict';

var MOVEMENT_SPEED = 2;
var JUMP_SPEED = -600;

// view representation of the character without any businesscode
// Controlled by another entity
function Character(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'character', 0);
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

Character.prototype.actionsMapping = {
    moveLeft: function() {
        this.x -= MOVEMENT_SPEED;
            
        if (!this.body.onFloor()) return;

        if (!this.isLookingLeft()) {
            this.animations.play('rightBackward');
        } else {
            this.animations.play('leftForward');
        }
    },

    moveRight: function() {
        this.x += MOVEMENT_SPEED;

        if (!this.body.onFloor()) return;
        
        if (this.isLookingLeft()) {
            this.animations.play('leftBackward');
        } else {
            this.animations.play('rightForward');
        }
    },

    jump: function() {
        if (!this.body.onFloor()) return;

        this.body.velocity.y = JUMP_SPEED;
    }
};

Character.prototype.callAction = function(action) {
    if (this.actionsMapping[action]) {
        this.actionsMapping[action].call(this);
    }
};

Character.prototype.lookLeft = function() {
    if (!this.body.onFloor()) {
        this.frame = 5;
    } else {
        this.frame = 3;
    }
};

Character.prototype.lookRight = function() {
    if (!this.body.onFloor()) {
        this.frame = 2;
    } else {
        this.frame = 0;
    }
};

Character.prototype.isLookingLeft = function() {
    return this.game.input.activePointer.x < this.x - this.game.camera.x;
};

module.exports = Character;
