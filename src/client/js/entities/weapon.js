/**
* Studiengang: MultimediaTechnology / FHS
* Zweck: Web (Basisqualifikationen)
* Autor: Erfan Ebrahimnia
*/

'use strict';

// later this entity should derive from an item entity
// and offer a base for other weapons
function Weapon(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'pewpew', 0);

    this.projectilesGrp = null;
}

Weapon.prototype = Object.create(Phaser.Sprite.prototype);
Weapon.prototype.constructor = Weapon;

Weapon.prototype.useProjectiles = function(projectilesGrp) {
    this.projectilesGrp = projectilesGrp;
};

Weapon.prototype.shoot = function(angle, shooter) {
    this.projectilesGrp.fire(this.world, angle, this.width * 1.7, shooter);
};

module.exports = Weapon;
