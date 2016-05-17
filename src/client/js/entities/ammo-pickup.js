/**
* Studiengang: MultimediaTechnology / FHS
* Zweck: Web (Basisqualifikationen)
* Autor: Erfan Ebrahimnia
*/

'use strict';

function AmmoPickup(game, x, y, id) {
    Phaser.Sprite.call(this, game, x, y, 'ammoPickup', 0);

    this.id = id;

    this.type = 'ammo';

    this.angle = game.rnd.integer();
}

AmmoPickup.prototype = Object.create(Phaser.Sprite.prototype);
AmmoPickup.prototype.constructor = AmmoPickup;

AmmoPickup.prototype.update = function() {
    this.angle += 1;
};

module.exports = AmmoPickup;
