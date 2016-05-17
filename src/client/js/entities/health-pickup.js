/**
* Studiengang: MultimediaTechnology / FHS
* Zweck: Web (Basisqualifikationen)
* Autor: Erfan Ebrahimnia
*/

'use strict';

function HealthPickup(game, x, y, id) {
    Phaser.Sprite.call(this, game, x, y, 'healthPickup', 0);

    this.id = id;

    this.type = 'health';

    this._scale = game.rnd.integer();
}

HealthPickup.prototype = Object.create(Phaser.Sprite.prototype);
HealthPickup.prototype.constructor = HealthPickup;

HealthPickup.prototype.update = function() {
    this._scale += 0.01;
    this.scale.setTo(0.5 * (1 + Math.abs(Math.sin(this._scale))));
};

module.exports = HealthPickup;
