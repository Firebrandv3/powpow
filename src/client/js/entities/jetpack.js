/**
* Studiengang: MultimediaTechnology / FHS
* Zweck: Web (Basisqualifikationen)
* Autor: Erfan Ebrahimnia
*/

'use strict';

// later this entity should derive from an item entity
function JetPack(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'jetpack', 0);

    this.addAnimations();
}

JetPack.prototype = Object.create(Phaser.Sprite.prototype);
JetPack.prototype.constructor = JetPack;

JetPack.prototype.addAnimations = function() {
    this.animations.add('active', [1, 2], 10, true);
};

JetPack.prototype.start = function() {
    this.animations.play('active');
};

JetPack.prototype.stop = function() {
    this.frame = 0;
};

module.exports = JetPack;
